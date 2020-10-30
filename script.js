'use strict'

class Keyboard {
  constructor(fieldElement) {
    this.keyboard = null;
    this.display = fieldElement;
    this.properties = {
      cursorPosition: 0,
      audio: true,
      value: '',
      end: '',
      capsLock: false,
      shift: false,
      ru: 0,
      micro: false
    }
    this.keys = [[['`', 'ё'], '~'], ['1', '!'], ['2', ['@', '"']], ['3', ['#', '№']], ['4', ['$', ';']], ['5', '%'], ['6', ['^', ':']],
                 ['7', ['&', '?']], ['8', '*'], ['9', '('], ['0', ')'], ['-', '_'], ['=', '+'], 'Backspace',
                 [['q', 'й']], [['w', 'ц']], [['e', 'у']], [['r', 'к']], [['t', 'е']], [['y', 'н']], [['u', 'г']],
                 [['i', 'ш']], [['o', 'щ']], [['p', 'з']], [['[', 'х'], '{'], [[']', 'ъ'], '}'], 'Enter', 'Caps Lock',
                 [['a', 'ф']], [['s', 'ы']], [['d', 'в']], [['f', 'а']], [['g', 'п']], [['h', 'р']], [['j', 'о']],
                 [['k', 'л']], [['l', 'д']], [[';', 'ж'], ':'], [["'", 'э'], '"'], ['\\', ['|', '/']], 'Shift', [['z', 'я']], [['x', 'ч']],
                 [['c', 'с']], [['v', 'м']], [['b', 'и']], [['n', 'т']], [['m', 'ь']], [[',', 'б'], '<'], [['.', 'ю'], '>'], [['/', '.'], ['?', ',']],
                  'Space', 'Hide', 'EN', 'Left', 'Right', 'Audio', 'Micro'];

    this.init();
    this.createKeys();
    this.initCursorHandler();
    this.initKeyEnterHandler();
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
        case 'Right':
            button.classList.add("keyboard__key");
            button.dataset.keycode = 39;
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_arrow_right</i>`);
            break;
        case 'Left':
            button.classList.add("keyboard__key");
            button.dataset.keycode = 37;
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_arrow_left</i>`);
            break;
        case 'Hide':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_hide</i>`);
            break;
        case 'Space':
            button.classList.add("keyboard__key", "keyboard__key--extra-wide");
            button.dataset.keycode = 32;
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">space_bar</i>`);
            break;
        case 'Shift':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.dataset.keycode = 16;
            button.insertAdjacentHTML(`beforeend`, `
                <i class="material-icons">north</i>`);
            break;
        case 'Caps Lock':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.dataset.keycode = 20;
            button.insertAdjacentHTML(`beforeend`, `
               <i class="material-icons">keyboard_capslock</i>`);
            break;
        case 'Backspace':
            button.classList.add("keyboard__key", "keyboard__key--delete");
            button.dataset.keycode = 8;
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">backspace</i>`);
            break;
        case 'Enter':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            button.dataset.keycode = 13;
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">keyboard_return</i>`);
            break;
        case 'EN':
            button.classList.add("keyboard__key", "keyboard__key--wide");
            (this.properties.ru == 0) ? button.innerHTML = key : button.innerHTML = 'RU';
            break;
        case 'Audio':
            button.classList.add("keyboard__key");
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">music_note</i>`);
            break;
        case 'Micro':
            button.classList.add("keyboard__key");
            button.insertAdjacentHTML(`beforeend`, `
              <i class="material-icons">mic_off</i>`);
            break;
        default:
            let symbol = (key[0] instanceof Array) ? key[0][0] : key[0];
            if (symbol.toUpperCase().charCodeAt(0) > 90 ||
                symbol.toUpperCase().charCodeAt(0) < 48 ||
                symbol.toUpperCase().charCodeAt(0) == 61 ||
                symbol.toUpperCase().charCodeAt(0) == 59) {
              switch(symbol) {
                case '`':
                    button.dataset.keycode = 192;
                    break;
                case '-':
                    button.dataset.keycode = 189;
                    break;
                case '=':
                    button.dataset.keycode = 187;
                    break;
                case '[':
                    button.dataset.keycode = 219;
                    break;
                case ']':
                    button.dataset.keycode = 221;
                    break;
                case ';':
                    button.dataset.keycode = 186;
                    break;
                case "'":
                    button.dataset.keycode = 222;
                    break;
                case '\\':
                    button.dataset.keycode = 220;
                    break;
                case ',':
                    button.dataset.keycode = 188;
                    break;
                case '.':
                    button.dataset.keycode = 190;
                    break;
                case '/':
                    button.dataset.keycode = 191;
                    break;
              }
            } else button.dataset.keycode = symbol.toUpperCase().charCodeAt(0);
            button.classList.add("keyboard__key");
      }

      button.addEventListener('click', () => {
        if (button.innerHTML.length > 2 && button.firstChild.nextSibling.classList.contains('material-icons')) {
          switch(button.firstChild.nextSibling.innerHTML) {
            case 'keyboard_arrow_left':
                if (this.properties.cursorPosition > 0) --this.properties.cursorPosition;
                this.setCursorPosition();
                break;
            case 'keyboard_arrow_right':
                if (this.properties.cursorPosition < this.display.value.length) {
                  ++this.properties.cursorPosition;
                }
                this.setCursorPosition();
                break;
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
            case 'music_note':
                this.properties.audio = !this.properties.audio;
                button.querySelector('i').innerHTML = 'music_off';
                break;
            case 'music_off':
                this.properties.audio = !this.properties.audio;
                button.querySelector('i').innerHTML = 'music_note';
                break;
            case 'mic_off':
                this.properties.micro = !this.properties.micro;
                button.querySelector('i').innerHTML = 'mic';
                this.enableSpeech();
                break;
            case 'mic':
                this.properties.micro = !this.properties.micro;
                button.querySelector('i').innerHTML = 'mic_off';
                this.enableSpeech();
                break;
          }
        } else if (button.innerHTML.length == 2) {
            (this.properties.ru == 1) ? this.properties.ru = 0 : this.properties.ru = 1;
            this.changeLanguage();
        } else {
            this.properties.value += button.innerHTML;
            this.updateDisplay();
        }

        this.setAudio(button);
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
    this.properties.cursorPosition = this.display.selectionStart = this.display.selectionEnd = this.properties.value.length;
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
        this.getCurrentValue(this.display.value.substring(0, this.display.selectionStart));
        this.properties.cursorPosition = this.display.selectionStart;
      });
      setTimeout(() => {
        this.getEnd(this.display.value.substring(this.display.selectionEnd, this.display.value.length));
      }, 0);
    });
  }

  setCursorPosition() {
    this.display.focus();
    this.display.selectionStart = this.display.selectionEnd = this.properties.cursorPosition;
    this.getCurrentValue(this.display.value.substring(0, this.display.selectionStart));
    this.getEnd(this.display.value.substring(this.display.selectionEnd, this.display.value.length));
  }

  initKeyEnterHandler() {
    document.addEventListener('keydown', (evt) => {
      if (!this.keyboard.classList.contains("keyboard--hidden")) {
        if (this.keyboard.querySelector(`[data-keycode="${evt.keyCode}"]`)) {
          this.display.focus();

          let key = this.keyboard.querySelector(`[data-keycode="${evt.keyCode}"]`);
          if (evt.keyCode == 16) {
            this.properties.shift = !this.properties.shift;
            this.toggleShift();
            key.classList.toggle("keyboard__key--active");
          } else if (evt.keyCode == 20) {
              this.properties.capsLock = !this.properties.capsLock;
              this.changeCase();
              key.classList.toggle("keyboard__key--active");
          } else key.classList.add("keyboard__key--active");

          this.setAudio(key);
        }
      }
    })
    document.addEventListener('keyup', (evt) => {
      if (!this.keyboard.classList.contains("keyboard--hidden")) {
        if (this.keyboard.querySelector(`[data-keycode="${evt.keyCode}"]`)) {
          if (evt.keyCode == 16 || evt.keyCode == 20) return;
          this.display.focus();

          let key = this.keyboard.querySelector(`[data-keycode="${evt.keyCode}"]`);
          key.classList.remove("keyboard__key--active");

          this.properties.cursorPosition = this.display.selectionEnd;
          this.getCurrentValue(this.display.value.substring(0, this.display.selectionStart));
          this.getEnd(this.display.value.substring(this.display.selectionEnd, this.display.value.length));
        }
      }
    })
  }

  setAudio(btn) {
    if (this.properties.audio) {
      let audio;
      if (document.querySelector(`[data-soundkey="${btn.dataset.keycode}"]`)) {
        audio = document.querySelector(`[data-soundkey="${btn.dataset.keycode}"]`);
      } else {
        if (this.properties.ru) {
          audio = document.querySelector(`[data-soundkey="1"]`);
        } else {
          audio = document.querySelector(`[data-soundkey="0"]`);
        }
      }
      audio.currentTime = 0;
      audio.play();
    }
  }

  enableSpeech() {
    if (!this.properties.recognition) {
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      this.properties.recognition = new SpeechRecognition();
      this.properties.recognition.interimResults = true;
      this.properties.recognition.lang = (this.properties.ru) ? 'ru-RU' : 'en-EN';
      this.properties.recognition.addEventListener('result', (evt) => {
        const transcript = Array.from(evt.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

          if (evt.results[0].isFinal) {
            this.properties.value += ' ' + transcript;
            this.updateDisplay();
        }
      })
    }
    if (this.properties.micro) {
      this.properties.recognition.addEventListener('end', this.properties.recognition.start);
      this.properties.recognition.start();
    } else {
      this.properties.recognition.removeEventListener('end', this.properties.recognition.start);
      this.properties.recognition.stop();
    }
  }
}

const textarea = document.querySelector('textarea');
const keyboard = new Keyboard(textarea);
