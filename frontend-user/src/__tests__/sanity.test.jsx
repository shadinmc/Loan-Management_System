/* eslint-env vitest */
import { render, screen } from "@testing-library/react";

test("sanity check", () => {
  render(<div>Hello</div>);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
