'use strict'

class Keyboard {
  constructor(fieldElement) {
    this.keyboard = null;
    this.display = fieldElement;
    this.properties = {
      value: '',
      end: '',
      capsLock: false,
      shift: false,
      ru: 0
    }
    this.keys = [[['`', 'ё'], '~'], ['1', '!'], ['2', ['@', '"']], ['3', ['#', '№']], ['4', ['$', ';']], ['5', '%'], ['6', ['^', ':']],
                 ['7', ['&', '?']], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'Backspace',
                 [['q', 'й']], [['w', 'ц']], [['e', 'у']], [['r', 'к']], [['t', 'е']], [['y', 'н']], [['u', 'г']],
                 [['i', 'ш']], [['o', 'щ']], [['p', 'з']], [['[', 'х'], '{'], [[']', 'ъ'], '}'], 'Enter', 'Caps Lock',
                 [['a', 'ф']], [['s', 'ы']], [['d', 'в']], [['f', 'а']], [['g', 'п']], [['h', 'р']], [['j', 'о']],
                 [['k', 'л']], [['l', 'д']], [[';', 'ж'], ':'], [["'", 'э'], '"'], ['\\', ['|', '/']], 'Shift', [['z', 'я']], [['x', 'ч']],
                 [['c', 'с']], [['v', 'м']], [['b', 'и']], [['n', 'т']], [['m', 'ь']], [[',', 'б'], '<'], [['.', 'ю'], '>'], [['/', '.'], ['?', ',']], 'Space', 'Hide', 'EN'];

    this.init();
    this.createKeys();
    this.initCursorHandler();
  }

  init() {
    this.keyboard = document.createElement("div");
    this.keyboard.classList.add("keyboard", "keyboard--hidden");

    document.body.append(this.keyboard);

    this.display.addEventListener('focus', () => {
      this.keyboard.classList.remove("keyboard--hidden");
    })

  }

  createKeys(ru = this.properties.ru) {
    for (let key of this.keys) {
      let button = document.createElement("button");
      if (key instanceof Array) {
        if (key[0] instanceof Array) button.innerHTML = key[0][ru];
        else button.innerHTML = key[0];
        if (key[1] instanceof Array) button.dataset.shift = key[1][ru];
        else if (key[1] != undefined && (ru != 1 || !(key[0] instanceof Array))) button.dataset.shift = key[1];
      }

      switch(key) {
        case 'Hide':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_hide</i>`);
            break;
        case 'Space':
            button.classList.add("keyboard__key", "keyboard__key--extra-wide");
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">space_bar</i>`);
            break;
        case 'Shift':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.insertAdjacentHTML(`beforeend`, `
                <i class="material-icons">north</i>`);
            break;
        case 'Caps Lock':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_capslock</i>`);
            break;
        case 'Backspace':
            button.classList.add("keyboard__key", "keyboard__key--delete");
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">backspace</i>`);
            break;
        case 'Enter':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">keyboard_return</i>`);
            break;
        case 'EN':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            (this.properties.ru == 0) ? button.innerHTML = key : button.innerHTML = 'RU';
            break;
        default:
            button.classList.add("keyboard__key");
      }

      button.addEventListener('click', () => {
        if (button.innerHTML.length > 2 && button.firstChild.nextSibling.classList.contains('material-icons')) {
          switch(button.firstChild.nextSibling.innerHTML) {
            case 'north':
                this.properties.shift = !this.properties.shift;
                button.classList.toggle("keyboard__key--active");
                this.toggleShift();
                break;
            case 'keyboard_hide':
                this.keyboard.classList.add("keyboard--hidden");
                break;
            case 'space_bar':
                this.properties.value += ' ';
                this.updateDisplay();
                break;
            case 'keyboard_return':
                this.properties.value += '\n';
                this.updateDisplay();
                break;
            case 'keyboard_capslock':
                this.properties.capsLock = !this.properties.capsLock;
                button.classList.toggle("keyboard__key--active");
                this.changeCase();
                break;
            case 'backspace':
                this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                this.updateDisplay();
                break;
          }
        } else if (button.innerHTML.length == 2) {
            (this.properties.ru == 1) ? this.properties.ru = 0 : this.properties.ru = 1;
            this.changeLanguage();
        } else {
            this.properties.value += button.innerHTML;
            this.updateDisplay();
        }
      })

      this.keyboard.append(button);
    }
  }

  changeCase() {
    let keys = this.keyboard.querySelectorAll('button');
    if (this.properties.capsLock && !this.properties.shift || !this.properties.capsLock && this.properties.shift) {
      keys.forEach((key) => {
        if (key.innerHTML.length == 1) key.innerHTML = key.innerHTML.toUpperCase();
      })
    } else {
      keys.forEach((key) => {
        if (key.innerHTML.length == 1) key.innerHTML = key.innerHTML.toLowerCase();
      })
    }
  }

  toggleShift() {
    let btns = this.keyboard.querySelectorAll('button');
    btns.forEach(btn => {
      if (btn.dataset.shift) {
        let temp = btn.dataset.shift;
        btn.dataset.shift = btn.innerHTML;
        btn.innerHTML = temp;
      }
    })
    this.changeCase();
  }

  changeLanguage() {
    this.keyboard.querySelectorAll('button').forEach(btn => btn.remove());
    this.createKeys(this.properties.ru);

    let togglers = this.keyboard.querySelectorAll(".keyboard__key--wide");
    if (this.properties.shift) {
      togglers[2].classList.add("keyboard__key--active");
      this.toggleShift();
      this.changeCase();
    }
    if (this.properties.capsLock) {
      togglers[1].classList.add("keyboard__key--active");
      this.changeCase();
    }
  }

  updateDisplay() {
    this.display.focus();
    this.display.value = this.properties.value + this.properties.end;
    this.display.selectionStart = this.display.selectionEnd = this.properties.value.length;
  }

  getCurrentValue(value) {
    this.properties.value = value;
  }

  getEnd(value) {
    this.properties.end = value;
  }

  initCursorHandler() {
    this.display.addEventListener('click', () => {
      setTimeout(() => {
        this.getCurrentValue(this.display.value.substring(0, this.display.selectionStart)), 0
      });
      setTimeout(() => {
        this.getEnd(this.display.value.substring(this.display.selectionEnd, this.display.value.length)), 0
      });
    });
  }


}

const textarea = document.querySelector('textarea');
const keyboard = new Keyboard(textarea);
