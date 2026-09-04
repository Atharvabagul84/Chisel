export interface UserStory {
  id: string;
  persona: string;
  goal: string;
  benefit: string;
}

export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  requestBody?: Record<string, string>;
  responseBody: Record<string, string>;
  statusCodes: { code: number; description: string }[];
}

export interface UIComponent {
  name: string;
  description: string;
  props: string[];
  tailwindClasses: string;
}

export interface AcceptanceCriterion {
  id: string;
  given: string;
  when: string;
  then: string;
}

export interface PRD {
  title: string;
  summary: string;
  userStories: UserStory[];
  apiSpec: APIEndpoint[];
  uiComponents: UIComponent[];
  acceptanceCriteria: AcceptanceCriterion[];
  metadata: {
    generatedAt: string;
    tone: string;
    audience: string;
    inputLength: number;
    estimatedEffort: string;
  };
}

export type Tone = "technical" | "balanced" | "non-technical";
export type Audience = "dev-team" | "founder" | "pm";

export interface GenerateRequest {
  note: string;
  tone: Tone;
  audience: Audience;
}
