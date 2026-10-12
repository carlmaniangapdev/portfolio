import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "features", "portfolio", "template.html"), "utf8");
const body = source.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1];

if (!body) {
  throw new Error("The portfolio template does not contain a body element.");
}

const profileCard = `
  <figure class="profile-panel reveal">
    <div class="profile-photo-wrap">
      <img src="/profile.jpg" alt="Carl Angelo M. Maniangap" width="520" height="650">
      <span class="profile-photo-status"><i></i> Software Developer</span>
    </div>
    <figcaption>
      <span>THE PERSON BEHIND THE APPS</span>
      <p>I enjoy learning how things work, solving practical problems, and turning ideas into apps people can use.</p>
    </figcaption>
  </figure>`;

export const portfolioMarkup = body
  .replace('<div class="about-content reveal">', `<div class="about-content reveal">${profileCard}`);
