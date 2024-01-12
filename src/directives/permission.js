import { usePermission } from './usePermission';

export const permission = {
  mounted(el, binding) {
    if (binding.value == undefined) return;
    const { action, effect } = binding.value;
    const { hasPermission } = usePermission();
    if (!hasPermission(action)) {
      if (effect == 'remove') {
        el.remove();
      } else {
        el.disabled = true;
        el.style['disabled'] = 'disabled';
        el.classList.add('n-button--disabled');
      }
    }
  }
};
