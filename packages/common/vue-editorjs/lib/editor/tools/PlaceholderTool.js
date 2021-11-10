export class PlaceholderTool {
  /** @type {String} */
  tag = 'SPAN';
  /** @type {Boolean} */
  _state = false;
  /** @type {Element | null} */
  button = null;
  /** @type {Element | null} */
  select = null;
  /** @type {import("@editorjs/editorjs").API} */
  api;
  /** @type {String} */
  className = 'de-placeholder';
  /** @type {String[]} */
  placeholders = [];
  /** @type {String} */
  buttonContent = 'P';

  /**
   * Constructor
   * @param {import("@editorjs/editorjs").InlineToolConstructorOptions} options
   * @param {import("@editorjs/editorjs").API} options.api api provided by editor.js
   * @param {import("@editorjs/editorjs").ToolConfig} options.config config from editor init
   * @param {String[]} options.config.placeholders placeholders list
   * @param {String} options.config.className class name for placeholder DOM element
   * @param {String} options.config.buttonContent content of toolbar button
   */
  constructor({ api, config }) {
    const {
      placeholders,
      className,
      buttonContent
    } = config;

    this.api = api;
    if (className) { this.className = className; }
    if (placeholders) { this.placeholders = placeholders; }
    if (buttonContent) { this.buttonContent = buttonContent; }
  }

  /**
   * Method required by editor.js, shows that tool is inline
   * @returns {Boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Tool title
   * @returns {String}
   */
  static get title() {
    return 'Placeholder';
  }

  /**
   * @returns {Boolean} tool state
   */
  get state() {
    return this._state;
  }

  /**
   * @param {Boolean} tool state
   */
  set state(state) {
    this._state = state;
    this.button.classList.toggle(this.api.styles.inlineToolButtonActive, state);
  }

  /**
   * Required by editor.js, create UI of button
   *
   * @returns {Element} button
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = this.buttonContent;
    this.button.classList.add(this.api.styles.inlineToolButton);

    return this.button;
  }

  /**
   * Create additional element below the buttons
   * @returns {Element} select
   */
  renderActions() {
    this.select = document.createElement('SELECT');
    this.select.value = null;

    const disabledOption = document.createElement('OPTION');
    disabledOption.setAttribute('disabled', true);
    disabledOption.setAttribute('selected', true);
    disabledOption.value = '';
    disabledOption.innerText = 'Select placeholder';

    this.select.appendChild(disabledOption);

    this.placeholders?.forEach((placeholder) => {
      const option = document.createElement('OPTION');
      option.value = placeholder;
      option.innerText = placeholder;
      this.select.appendChild(option);
    });

    this.select.hidden = false;

    return this.select;
  }

  /**
   * Show select
   */
  showActions() {
    const placeholderTag = this.api.selection.findParentTag(this.tag, this.className);

    if (this.placeholders.includes(placeholderTag.innerText)) {
      this.select.value = placeholderTag.innerText;
    }

    this.api.listeners.on(this.select, 'change', (e) => {
      placeholderTag.textContent = e.target.value;
    });
    this.select.hidden = false;
  }

  /**
   * Hide select
   */
  hideActions() {
    this.api.listeners.off(this.select, 'change');
    this.select.hidden = true;
  }

  /**
   * Required by editor.js, get Tool's activated state by selected range
   */
  checkState() {
    const placeholderTag = this.api.selection.findParentTag(this.tag, this.className);

    this.state = !!placeholderTag;

    if (this.state) {
      this.showActions();
    } else {
      this.hideActions();
    }
  }

  /**
   * @param {string} content text content
   * @returns {Element} placeholder tag
   */
  createPlaceholderTag(content) {
    const placeholderTag = document.createElement(this.tag);
    placeholderTag.classList.add(this.className);
    placeholderTag.textContent = content;
    placeholderTag.setAttribute('contenteditable', false); // other tools are not applicable
    placeholderTag.setAttribute('data-previous-text', content);

    return placeholderTag;
  }

  /**
   * Wrap selected text with placeholder tag
   * @param {Range} range
   */
  wrap(range) {
    const placeholderTag = this.createPlaceholderTag(range.toString());

    range.extractContents();
    range.insertNode(placeholderTag);
    this.api.selection.expandToTag(placeholderTag);
  }

  /**
   * Unwrap placeholder and replace it with text that was in this place before
   * @param {Range} range
   */
  unwrap(range) {
    const placeholderTag = this.api.selection.findParentTag(this.tag, this.className);
    const previousText = placeholderTag.getAttribute('data-previous-text');

    placeholderTag.remove();

    const previousTextNode = document.createTextNode(previousText);
    range.insertNode(previousTextNode);
  }

  /**
   * Required by editor.js, works with selected range
   * @param {Range} range
   */
  surround(range) {
    if (this.state) {
      this.unwrap(range);
    } else {
      this.wrap(range);
    }
  }
}
