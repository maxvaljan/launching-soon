# UI Components Styling Guide

## Button Styling Standards

All buttons across the web application should use consistent styling to maintain a cohesive user experience:

### Border Radius

- Use `rounded-xl` for all buttons across the application
- This applies to both standard buttons and dropdown menu triggers

### Example

```tsx
<Button className="rounded-xl">Click Me</Button>
```

### Default Implementation

The default Button component in `button.tsx` already includes `rounded-xl` in its base styling. When using the Button component without overriding the className, you'll automatically get consistent styling.

### Custom Button Styling

If you need to create custom button-like elements:

1. Prefer using the Button component
2. If creating a custom element, use `rounded-xl` for consistency
3. Avoid using other radius values like `rounded-full` or `rounded-md` for button-like elements

### Color Standards

For action buttons:

- Default state: darker color (e.g., `bg-maxmove-blue`)
- Hover state: lighter color (e.g., `hover:bg-maxmove-blue`)

## Other UI Components

More styling guidelines to be added for additional UI components.
