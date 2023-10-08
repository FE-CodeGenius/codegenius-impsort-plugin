import path from "node:path";
import { performance } from "node:perf_hooks";

import type { CAC } from "cac";
import {
  ACTIVATION,
  CodeGeniusOptions,
  impSortGlob,
  ImpSortOptions,
  loggerInfo,
  printError,
  printInfo,
} from "code-genius";
import enquirer from "enquirer";
import { ESLint } from "eslint";
import fs from "fs-extra";

const mergeConfig = async (config: CodeGeniusOptions) => {
  const commands = config && config?.commands;
  if (commands && commands.impsort) {
    const { paths } = commands.impsort;
    return {
      paths: paths && paths.length > 0 ? paths : impSortGlob,
    };
  }
  return {
    paths: impSortGlob,
  };
};

const generateEnquirer = async (
  config: CodeGeniusOptions,
): Promise<ImpSortOptions> => {
  const files = fs
    .readdirSync(path.join(process.cwd(), "."))
    .filter((v) => !v.startsWith("."))
    .map((file) => {
      return {
        sort: fs.statSync(path.join(process.cwd(), file)).isFile() ? 1 : 0,
        file,
      };
    });
  files.sort((v1, v2) => v1.sort - v2.sort);
  const { paths } = await mergeConfig(config);
  const fileMultiChoices = files.map((v) => {
    return {
      name: `./${v.file}`,
      message: `${v.file}`,
      hint: paths.includes(`./${v.file}`) ? "建议尝试修复" : "",
    };
  });
  const result = await enquirer.prompt<ImpSortOptions>([
    {
      name: "files",
      type: "multiselect",
      message: "请选择需要尝试修复的文件/夹",
      choices: fileMultiChoices,
    },
  ]);
  return {
    files: result.files,
  };
};

const impSort = async (paths: string[]) => {
  if (ACTIVATION) {
    loggerInfo(`impSort 参数信息: \n ${JSON.stringify(paths)}`);
  }

  const eslint = new ESLint({
    fix: true,
    overrideConfig: {
      plugins: ["simple-import-sort"],
      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
      },
    },
  });

  const results = await eslint.lintFiles([...paths]);
  await ESLint.outputFixes(results);
  const formatter = await eslint.loadFormatter("stylish");
  const resultText = await formatter.format(results);
  if (!resultText) {
    printInfo("模块导入顺序已修复完毕");
  } else {
    printError(resultText);
  }
};

const impSortInstaller = (config: CodeGeniusOptions) => {
  return {
    name: "impSortInstaller",
    setup: (cli: CAC) => {
      cli
        .command("impsort", "运行 eslint 对模块导入进行分组&按字母排序")
        .option("-p, --pattern <pattern>", "设置匹配规则")
        .option("-a, --ask", "启用询问模式")
        .action(async (options) => {
          const { pattern, ask } = options;
          let paths = [];
          if (ask) {
            const result = await generateEnquirer(config);
            paths = result.files;
          } else {
            paths = typeof pattern === "string" ? [pattern] : pattern;
          }
          const start = performance.now();
          await impSort(paths);
          const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;
          loggerInfo(`😁 impsort 命令执行结束, 共用时: ${getTime()}`);
        });
    },
  };
};

export { impSort, impSortInstaller };
