import { eslintFix } from "code-genius";
import { impSort } from "code-genius";
import { checkGitUserEmail } from "code-genius";
import { prettierFormat } from "code-genius";
import { execCommand } from "code-genius";

async function lint() {
  await checkGitUserEmail("^[a-zA-Z0-9._%+-]+@(gmail)\\.(com)$");
  await prettierFormat(["./src/", "./scripts/"]);
  await eslintFix(["./src/", "./scripts/"]);
  await impSort(["./src/", "./scripts/"]);
  await execCommand("git", ["add", "."]);
}

lint();
