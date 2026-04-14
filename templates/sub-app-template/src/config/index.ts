/** iconfont 静态目录（与 `iconfont.json` / `iconfont.js` 同级，可通过环境变量覆盖） */
const ICONFONT_DIR = 'http://192.168.14.46:5555';
const MENU_ICONFONT_DIR =
  (import.meta.env.VITE_ICONFONT_DIR as string | undefined)?.replace(/\/+$/, '') ||
  `${ICONFONT_DIR}/iconfont`;

/** AzuraIconSelect：拉取 glyph 列表（仅元数据，不会注入 SVG） */
export const MENU_ICONFONT_CONFIG_URL = `${MENU_ICONFONT_DIR}/iconfont.json`;

/** AzuraIcon `icon-*`：必须由 Symbol 包里的 `iconfont.js` 注入 `<symbol>`，请与上面 JSON 同属一个 iconfont 项目 */
export const MENU_ICONFONT_SYMBOL_JS_URL = `${MENU_ICONFONT_DIR}/iconfont.js`;

/** AzuraIconSelect url 图标列表地址 */
export const MENU_URL_ICON_LIST_URL = `${ICONFONT_DIR}/url-icons.json`;

/** AzuraIcon/AzuraIconSelect urlIcon 资源基础地址 */
export const MENU_URL_ICON_BASE_URL = ICONFONT_DIR;
