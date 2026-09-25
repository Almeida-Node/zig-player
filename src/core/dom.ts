export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { class?: string; label?: string; html?: string; text?: string } = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.class) el.className = props.class;
  if (props.label) el.setAttribute("aria-label", props.label);
  if (props.html !== undefined) el.innerHTML = props.html;
  if (props.text !== undefined) el.textContent = props.text;
  for (const child of children) el.append(child);
  return el;
}

/** Botão grande de ícone. O rótulo é lido por leitores de tela, não precisa ser lido pela criança. */
export function iconButton(icon: string, label: string, onTap: () => void, extraClass = ""): HTMLButtonElement {
  const btn = h("button", { class: `icon-btn ${extraClass}`.trim(), label, html: icon });
  btn.type = "button";
  btn.addEventListener("click", onTap);
  return btn;
}
