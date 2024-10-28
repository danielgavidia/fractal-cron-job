import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function openaiChatCompletions(
  model: string,
  systemContent: string,
  userContent: string
): Promise<string> {
  const res = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const data = res.choices[0].message.content;
  if (data) {
    return data;
  } else {
    throw new Error();
  }
}

export async function getPullRequestDiffSummary(diff: string): Promise<string> {
  const model = "gpt-4o-mini";
  const systemContent = `
    You are a helpful assistant tasked with summarizing text effectively. 
    You will be provided strings containing the code changes in Github pull requests. 
    They are called 'Diffs'. 
    Avoid starting your answer with 'This pull request...' or 'The pull request' or using the passive voice.`;
  const userContent = `In 150 characters maximum, summarize the following pull request diff: ${diff}`;

  const res = await openaiChatCompletions(model, systemContent, userContent);
  return res;
}

export async function getPullRequestManyBlockers(diffs: string): Promise<string> {
  const model = "gpt-4o-mini";
  const systemContent = `
    You are a helpful assistant tasked with summarizing text effectively. 
    You will be provided strings containing the code changes in Github pull requests from a coding school student. 
    They are called 'Diffs'. 
    Avoid starting your answer with 'This pull request...' or 'The pull request' or using the passive voice.
    Limit answers to 100 characters.
    Respond in a single sentence.
    Do not include bullet points in answer.
    Do not talk about 'diffs'.`;
  const userContent = `Summarize all the blockers in these diffs: ${diffs}`;

  const res = await openaiChatCompletions(model, systemContent, userContent);
  return res;
}

export async function getPullRequestManyLearnings(diffs: string): Promise<string> {
  const model = "gpt-4o-mini";
  const systemContent = `
    You are a helpful assistant tasked with summarizing text effectively. 
    You will be provided strings containing the code changes in Github pull requests from a coding school student. 
    They are called 'Diffs'. 
    Sound casual, personable, and instrospective, while keeping it professional.
    Limit answers to 100 characters.
    Respond in a single sentence.
    Use the first person.
    Do not include bullet points in answer.
    Do not talk about 'diffs'.`;
  const userContent = `Provide professional growth lessons derived from these diffs: ${diffs}`;

  const res = await openaiChatCompletions(model, systemContent, userContent);
  if (res) {
    return res;
  } else {
    throw new Error();
  }
}

export async function getPullRequestManyWins(diffs: string): Promise<string> {
  const model = "gpt-4o-mini";
  const systemContent = `
    You are a helpful assistant tasked with summarizing text effectively. 
    You will be provided strings containing the code changes in Github pull requests from a coding school student. 
    They are called 'Diffs'. 
    Sound excited for all the coding victories you accomplished today, while keeping it professional.
    Limit answers to 100 characters.
    Respond in a single sentence.
    Use the first person.
    Do not include bullet points in answer.
    Do not talk about 'diffs'.`;
  const userContent = `Provide personal wins derived from these diffs: ${diffs}`;

  const res = await openaiChatCompletions(model, systemContent, userContent);
  return res;
}
