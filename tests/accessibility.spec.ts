/**
 * Compatible with runtimes 2024.02 and later.
 *
 * To learn more about Playwright Test visit:
 * https://checklyhq.com/docs/browser-checks/playwright-test/
 * https://playwright.dev/docs/writing-tests
 *
 * To learn more about accessibility testing with Playwright and Axe visit:
 * https://playwright.dev/docs/accessibility-testing
 */

import { expect, test } from "@playwright/test"
// Import AxeBuilder from the axe-core/playwright package needed for a11y testing
import { AxeBuilder } from "@axe-core/playwright"

// Configure the Playwright Test timeout to 210 seconds,
// ensuring that longer tests conclude before Checkly's browser check timeout of 240 seconds.
// The default Playwright Test timeout is set at 30 seconds.
// For additional information on timeouts, visit: https://checklyhq.com/docs/browser-checks/timeouts/
test.setTimeout(210000)

// Set the action timeout to 10 seconds to quickly identify failing actions.
// By default Playwright Test has no timeout for actions (e.g. clicking an element).
test.use({ actionTimeout: 10000 })

// We add a testInfo object to our test, letting us attach any
// a11y violations to the test report later
test("Verifying page accessibility", async ({ page }, testInfo) => {
  // Change the URL to your site's URL,
  // or, even better, define an ENVIRONMENT_URL environment variable
  // to reuse it across your browser checks
  await page.goto(
    process.env.ENVIRONMENT_URL || "https://welcome.checklyhq.com",
  )

  await test.step("Check accessibility with AxeBuilder", async () => {
    // Use AxeBuilder to check the page for Accessibility violations including WCAG
    const { violations } = await new AxeBuilder({ page }).analyze()

    // Attach any accessibility violations to the Playwright test report
    // You can access attachments from the trace in the test report
    await testInfo.attach("accessibility-scan-results", {
      body: JSON.stringify(violations, null, 2),
      contentType: "application/json",
    })

    // Fail the test if any accessibility violations are detected
    expect(violations).toHaveLength(0)
  })
})
