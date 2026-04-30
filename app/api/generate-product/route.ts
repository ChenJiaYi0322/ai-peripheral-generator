import { generateText, Output } from 'ai'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().describe('产品名称'),
  tagline: z.string().describe('一句话描述'),
  description: z.string().describe('详细的产品描述（2-3句话）'),
  features: z
    .array(
      z.object({
        title: z.string().describe('功能标题'),
        description: z.string().describe('功能描述'),
      })
    )
    .max(5)
    .describe('产品核心功能列表（3-5个）'),
})

export async function POST(req: Request) {
  const { productName } = await req.json()

  if (!productName || typeof productName !== 'string') {
    return Response.json(
      { error: '请输入有效的产品名称' },
      { status: 400 }
    )
  }

  const { object } = await generateText({
    model: 'openai/gpt-4o-mini',
    system: `你是一个创意产品营销专家。你精通创意文案写作和产品设计语言，能够为任何计算机外设创建引人注目的营销内容。
你的任务是为给定的产品创建高质量的营销内容，包括吸引人的描述和关键功能。
内容应该遵循 Apple 风格的极简主义美学，强调创新和设计的优雅性。
所有输出必须用中文。`,
    prompt: `为以下计算机外设创建营销内容：${productName}

请生成：
1. 产品标语（简洁有力的一句话）
2. 详细描述（2-3句话，突出其独特之处）
3. 5个核心功能及其说明

使用创意和吸引力的语言，但保持专业和真实。`,
    output: Output.object({ schema: productSchema }),
  })

  return Response.json(object)
}
