import {
  BMICalculateRequestSchema,
  BMICalculateResponseSchema,
  type BMICalculateRequest,
  type BMICalculateResponse,
} from "../types/bmi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, "");

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured");
}

const REQUEST_TIMEOUT_MS = 8000;

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(params: { message: string; status?: number; code?: string; details?: unknown }) {
    super(params.message);
    this.name = "ApiError";
    this.status = params.status ?? 0;
    this.code = params.code ?? "API_ERROR";
    this.details = params.details;
  }
}

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

async function parseErrorResponse(response: Response): Promise<ApiError> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await response.json().catch(() => null);

    const message =
      body?.detail ??
      body?.error ??
      body?.message ??
      `Request failed with status ${response.status}`;

    return new ApiError({
      message,
      status: response.status,
      code: "HTTP_ERROR",
      details: body,
    });
  }

  const text = await response.text().catch(() => "");

  return new ApiError({
    message: text || `Request failed with status ${response.status}`,
    status: response.status,
    code: "HTTP_ERROR",
    details: text || undefined,
  });
}

export async function calculateBMI(payload: BMICalculateRequest): Promise<BMICalculateResponse> {
  const validPayload = BMICalculateRequestSchema.parse(payload);

  let response: Response;

  try {
    response = await fetch(buildUrl("/bmi/calculate"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(validPayload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error: unknown) {
    if (isAbortError(error)) {
      throw new ApiError({
        message: "Request timed out. Please try again.",
        code: "TIMEOUT",
      });
    }

    throw new ApiError({
      message: "Unable to reach the server. Check your connection and try again.",
      code: "NETWORK_ERROR",
      details: error,
    });
  }

  if (!response.ok) {
    throw await parseErrorResponse(response);
  }

  const rawData: unknown = await response.json().catch(() => {
    throw new ApiError({
      message: "Server returned invalid JSON.",
      status: response.status,
      code: "INVALID_JSON",
    });
  });

  const parsed = BMICalculateResponseSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new ApiError({
      message: "Server response did not match the expected format.",
      status: response.status,
      code: "INVALID_RESPONSE_SHAPE",
      details: parsed.error.flatten(),
    });
  }

  return parsed.data;
}
