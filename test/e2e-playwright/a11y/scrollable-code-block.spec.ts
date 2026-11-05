/**
 * @prettier
 */
import { test, expect } from "../support/fixtures"

test.describe("Scrollable code blocks", () => {
  test.beforeEach(async ({ page, swaggerUi }) => {
    await page.goto(
      "/?url=/documents/features/scrollable-code-block.openapi.yaml"
    )
    await swaggerUi.toggleOperation("#operations-default-createItem")
  })

  for (const selector of [
    ".body-param__example.microlight",
    ".example.microlight",
  ]) {
    test(`can be focused and scrolled with the keyboard: ${selector}`, async ({
      page,
    }) => {
      const codeBlock = page.locator(selector).first()
      await expect(codeBlock).toBeVisible()

      // the example is long enough to overflow its max-height
      const isScrollable = await codeBlock.evaluate(
        (el) => el.scrollHeight > el.clientHeight
      )
      expect(isScrollable).toBe(true)

      await expect(codeBlock).toHaveAttribute("tabindex", "0")
      await codeBlock.focus()
      await expect(codeBlock).toBeFocused()

      await page.keyboard.press("ArrowDown")
      await page.keyboard.press("PageDown")
      await expect
        .poll(() => codeBlock.evaluate((el) => el.scrollTop))
        .toBeGreaterThan(0)
    })
  }
})
