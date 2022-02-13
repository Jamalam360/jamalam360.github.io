import { Marked } from "https://deno.land/x/markdown@v2.0.0/mod.ts";

const linkRegex = /\$\[(.*?)\]/;
let html = await Deno.readTextFile("./source/source.html");

function linkify(html: string): string {
  const links: Record<string, string> = {
    Blog: "https://jamalam.tech/blog",
    Deno: "https://deno.land/",
    Kordex: "https://github.com/Kord-Extensions/kord-extensions",
    Kotlin: "https://kotlinlang.org/",
    TypeScript: "https://www.typescriptlang.org/",
    TS: "https://www.typescriptlang.org/",
    JavaScript: "https://www.javascript.com/",
    JS: "https://www.javascript.com/",
    Java: "https://www.java.com/",
    Discord: "https://discord.com/",
    QuiltMC: "https://github.com/QuiltMC",
    Quilt: "https://github.com/QuiltMC",
    Fabric: "https://fabricmc.net/",
    Python: "https://www.python.org/",
    Aleph: "https://alephjs.org",
  };

  Object.keys(links).forEach((element) => {
    html = html.replaceAll(
      "[" + element + "]",
      `<a href="${links[element]}" class="text-success"><i>${element}</i></a>`,
    );
  });

  return html;
}

async function markdownify(html: string): Promise<string> {
  const matches = linkRegex.exec(html);
  console.log(matches);

  if (matches) {
    for (let i = 0; i < matches.length; i += 2) {
      const replace = matches[i];
      const link = matches[i + 1];

      html = html.replaceAll(
        replace,
        Marked.parse(
          await Deno.readTextFile(
            `./source/markdown/${link}.md`,
          ),
        ).content,
      );
    }
  }

  return html;
}

function format(html: string): string {
  var tab = "\t";
  var result = "";
  var indent = "";

  html.split(/>\s*</).forEach(function (element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + "<" + element + ">\r\n";

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}

html = linkify(html);
html = await markdownify(html);
html = format(html);

await Deno.writeTextFile("index.html", html);
