// src/directives/debounce.ts
import { debounce } from 'es-toolkit';
import type { Directive, DirectiveBinding } from 'vue';

// 扩展 HTMLElement 类型，以便在元素上临时存储处理函数引用（用于卸载时移除监听）
interface DebounceHTMLElement extends HTMLElement {
  __debounceHandler__?: any;
}

export const vDebounce: Directive = {
  mounted(el: DebounceHTMLElement, binding: DirectiveBinding) {
    // 1. 获取延迟时间
    // 允许通过 v-debounce:2000 指定延迟，默认 1000ms
    const delay = binding.arg ? parseInt(binding.arg) : 1000;

    // 2. 创建防抖函数 (使用 es-toolkit)
    // 关键配置: { edges: ['leading'] }
    // 含义: "前缘触发" —— 点击瞬间立即执行，然后在 delay 时间内忽略后续点击。
    // 这最适合按钮提交场景。
    const debouncedHandler = debounce(
      (e: Event) => {
        // 执行传入的回调函数
        if (typeof binding.value === 'function') {
          binding.value(e);
        }
      },
      delay,
      { edges: ['leading'] } 
    );

    // 3. 绑定点击事件
    el.addEventListener('click', debouncedHandler);

    // 4. 将函数引用存到元素上，以便 unmounted 时清理
    el.__debounceHandler__ = debouncedHandler;
  },

  unmounted(el: DebounceHTMLElement) {
    // 5. 清理事件监听和定时器
    if (el.__debounceHandler__) {
      el.removeEventListener('click', el.__debounceHandler__);
      // es-toolkit 的 debounce 返回的函数带有 cancel 方法，可以取消挂起的调用
      el.__debounceHandler__.cancel(); 
      delete el.__debounceHandler__;
    }
  }
};