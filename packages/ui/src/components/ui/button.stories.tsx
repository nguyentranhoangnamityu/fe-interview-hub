import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: { 
    layout: "centered",
    docs: {
      description: {
        component: "Một component Button linh hoạt với nhiều variants và sizes khác nhau. Hỗ trợ tất cả các props của HTML button element và có thể được sử dụng như một Slot component."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "Kiểu hiển thị của button"
    },
    size: {
      control: { type: "select" },
      options: ["default", "sm", "lg", "icon"],
      description: "Kích thước của button"
    },
    asChild: {
      control: { type: "boolean" },
      description: "Sử dụng Slot component thay vì button element"
    },
    disabled: {
      control: { type: "boolean" },
      description: "Vô hiệu hóa button"
    }
  }
}

export default meta
type Story = StoryObj<typeof Button>

// Default variant stories
export const Default: Story = {
  args: {
    children: "Button"
  }
}

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive"
  }
}

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline"
  }
}

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary"
  }
}

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost"
  }
}

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link"
  }
}

// Size variants
export const Small: Story = {
  args: {
    size: "sm",
    children: "Small"
  }
}

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large"
  }
}

export const Icon: Story = {
  args: {
    size: "icon",
    children: "🚀"
  }
}

// Disabled state
export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled"
  }
}

// With icon example
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        Button with icon
      </>
    )
  }
}

// Loading state example
export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <svg
          className="animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Loading...
      </>
    )
  }
}

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  )
}

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">🚀</Button>
    </div>
  )
}
