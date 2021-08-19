export const quote = ({ alignment, text, caption }) => {
  const styles = alignment ? `style="text-align: ${alignment}"` : '';
  return `<blockquote ${styles} class="de-quote">
      <p class="de-quote-text">${text || ''}</p>
      <cite class="de-quote-author">${caption || ''}</cite>
    </blockquote>`;
};
