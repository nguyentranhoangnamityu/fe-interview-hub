import fs from "fs"
import path from "path"

const componentName = process.argv[2]
if (!componentName) {
  console.error("❌ Missing component name: e.g. pnpm gen-story button")
  process.exit(1)
}

const componentPath = path.resolve(
  "packages/ui/src/components/ui",
  `${componentName}.stories.tsx`
)

if (fs.existsSync(componentPath)) {
  console.log(`⚠️ Story already exists: ${componentPath}`)
  process.exit(0)
}

const content = `import type { Meta, StoryObj } from "@storybook/react"
import { ${capitalize(componentName)} } from "./${componentName}"

const meta: Meta<typeof ${capitalize(componentName)}> = {
  title: "UI/${capitalize(componentName)}",
  component: ${capitalize(componentName)},
  parameters: { layout: "centered" },
  tags: ["autodocs"],
}
export default meta
type Story = StoryObj<typeof ${capitalize(componentName)}>

export const Default: Story = {
  args: {}
}
`

fs.writeFileSync(componentPath, content)
console.log(`✅ Created story: ${componentPath}`)

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
