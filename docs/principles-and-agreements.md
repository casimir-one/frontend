# Основные принципы и соглашения используемые в проекте

## Single-responsibility Principle (SRP)

**Принцип единственной ответственности** — принцип ООП который гласит: "объект должен отвечать только за одну вещь или делать одну вещь". Объект — это функция, переменная, класс, что угодно.

Принцип — это не закон и его стоит применять в зависимости от того, как изменяется приложение:
* если при изменении кода отвечающего за одну ответственность, затрагивается код отвечающий за другую ответственность, то это первый сигнал о нарушении SRP.
* если же изменения касаются только кода отвечающего за одну ответственность, то этот принцип можно не применять.


## Декомпозиция

**Декомпозиция** — разделение целого на части. В нашем случае, это умение делить код на логически составляющие.

Любой код условно можно разделить на составляющие

* получение данных
* обработка данных
* вывод обработанных данных

Любой этап может отсутствовать, но если брать стандартное монолитное микро-сервисное приложение, то это схема будет в какой-то мере прослеживаться.
И самое частое нарушение SRP, это когда несколько пунктов находятся в одном месте, например: получение и обработка данных или вывод и обработка. Наличие одного из перечисленных случаев говорит об ошибке.

Подробную информацию можете найти в сети по тегам:
[Single-responsibility Principle](https://www.google.com/search?q=Single-responsibility+Principle),
[SRP](https://www.google.com/search?q=SRP),
[Принцип единственной ответственности](https://www.google.com/search?q=%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF+%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9+%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8&ei=lz95Ycv8G-WvrgSHg7ugAg&ved=0ahUKEwiLpNPUxerzAhXll4sKHYfBDiQQ4dUDCA4&uact=5&oq=%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF+%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9+%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOgQIABANSgQIQRgAUOqFBVixkwVguJkFaAFwAngAgAGiAYgBigKSAQMwLjKYAQCgAQKgAQHAAQE&sclient=gws-wiz)


## Соглашения

- **[Styleguide по Markdown](https://arcticicestudio.github.io/styleguide-markdown/)**
- **именование методов и функций**
  происходит по схеме `function [action][triger][event] () { ... }`:
  ```vue
  <template>
    <button @click="handleAddItemBtnClick">Add Item</button>
  </template>
  <script>
    export default {
      methods: {
        handleAddItemBtnClick() {
          // do something
        }
      }
    }
  </script>
  ```
- **один метод - одно действие (группировка действий)**
  ```vue
  <template>
    <button @click="handleAddItemBtnClick">Add Item</button>
  </template>
  <script>
    export default {
      methods: {
        /** получение списка элементов по API */
        getList() {},

        /** добавление элемента */
        addItem() {},

        /** обработка клика по кнопке добавления элемента */
        handleAddItemBtnClick() {
          this.addItem();
          this.getList();
        }
      }
    }
  </script>
  ```
- **методы работающие с API содержат префикс** -
  `get/create/update/delete`
  ```javascript
  // Vuex Store
  const ACTIONS = {
    async getList({ commit }) {
      const res = await itemsService.getList();
      commit('setList', res);
    },
    async update({ commit }, item) {
      const res = await itemsService.update(item);
      commit('update', [ res ]);
    }
  }
  ```
- **async\await совместно с try\catch**
  вместо `.then().catch()`
- **обработка ошибок**
  - уровень поставщика данных - первый этап, ошибки полученные при запросе к серверу, проходят валидацию, затем пробрасывается дальше. Для обработки используется функция `type handleDataProviderError = (e: any) => Error`
  - уровень сервиса и Vuex Store Actions - ошибки не обрабатываются, пробрасывается дальше
  - уровень компонента UI (Vue) - конечный этап, ошибка отлавливается, по надобности пользователю показывается уведомление. Для обработки используется функция `type handleError = (e: any, options: object ) => void`, в опциях обязательно указывается `title` с названием действия `try { ... } catch (e) { handleError(e, { title: "Update user" }); }`
- **документирование кода**
  средствами JSDoc. Документированию подлежат:
  - переменные, если после инициализации тип значения будет отличаться от ткущего
  - функции и методы, если присутствует возвращаемое значение или аргумент
  - описание сущности, если поведение не очевидно
- **кроссплатформенный package.json**
  - для запуска команд в блоке `scripts` пакет `shx` для приведения к Unix-подобному синтаксису
  - для работы с переменными окружения используется пакет `cross-env`
  - для работы с архивами используется пакет `gzip-cli`
