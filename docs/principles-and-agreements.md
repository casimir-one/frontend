# Основные принципы и соглашения используемые в проекте

## Single-responsibility Principle (SRP) и Декомпозиция

**Принцип единственной ответственности** — принцип ООП который гласит: "объект должен отвечать только за одну вещь или
делать одну вещь". Принцип применяется не только к объекту, это может быть: функция, класс или переменная.

Принцип — это не закон и его стоит применять в зависимости от того, как изменяется приложение:

* если при изменении кода отвечающего за одну ответственность, затрагивается код отвечающий за другую ответственность,
  то это первый сигнал о нарушении SRP.
* если же изменения касаются только кода отвечающего за одну ответственность, то этот принцип можно не применять.

**Декомпозиция** — разделение целого на части. В нашем случае, это умение делить код на логически составляющие.

Любой код условно можно разделить на составляющие

* получение данных
* обработка данных
* вывод обработанных данных

Любой этап может отсутствовать, но если брать стандартное монолитное микро-сервисное приложение, то это схема будет в
какой-то мере прослеживаться. И самое частое нарушение SRP, это когда несколько пунктов находятся в одном месте,
например: получение и обработка данных или вывод и обработка. Наличие одного из перечисленных случаев говорит об ошибке.

Подробную информацию можете найти в сети:

- [Принцип единственной ответственности на Wikipedia](https://ru.wikipedia.org/wiki/%D0%9F%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF_%D0%B5%D0%B4%D0%B8%D0%BD%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D0%B9_%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8#:~:text=single%2Dresponsibility%20principle%2C%20SRP),%D0%B8%D1%81%D0%BA%D0%BB%D1%8E%D1%87%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%20%D0%BD%D0%B0%20%D0%BE%D0%B1%D0%B5%D1%81%D0%BF%D0%B5%D1%87%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%8D%D1%82%D0%BE%D0%B9%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%81%D1%82%D0%B2%D0%B5%D0%BD%D0%BD%D0%BE%D1%81%D1%82%D0%B8.)
- По тегу [Single-responsibility Principle](https://www.google.com/search?q=Single-responsibility+Principle)

## Соглашения

- **[Styleguide по Markdown](https://arcticicestudio.github.io/styleguide-markdown/)** - рекомендации по ведению
  документации
- **именование методов, функций и обработка событий** - функцию условно можно разделить на глагол и существительное,
  например `makeSomeClassInstance()` - `make` - действие,
  `someClassInstance` - существительное, т.е. действие, а потом пояснение. Функцию обработчик событий именуем по
  схеме `[action][triger][event]()`:
  ```vue
  <template>
    <div class="simple-list">
      <SimpleListItem
        v-for="(item, index) in model"
        :data="item"
        @delete="handleSimpleListItemDelete(index)"
      />
      <button @click="handleAddItemBtnClick">Add Item</button>
    </div>
  </template>

  <script>
    export default {
      data() {
        return {
          model: []
        }
      },
      created() {
        this.getList();
      },
      methods: {
        async getList() {
          this.model = Promise.resolve(['one', 'two', 'three'])
        },

        addItem() {
          this.model.push("new item")
        },

        deleteItem(index) {
          this.model.splice(index, 1)
        },

        handleAddItemBtnClick() {
          this.addItem();
          this.getList();
        },

        handleSimpleListItemDelete(index) {
          this.deleteItem(index);
          this.getList();
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
  - уровень поставщика данных - первый этап, ошибки полученные при запросе к серверу, проходят валидацию, затем
    пробрасывается дальше. Для обработки используется функция `handleDataProviderError(e)`, которая аргументом принимает
    ошибку и возвращает ошибку.
  - уровень сервиса и Vuex Store Actions - ошибки не обрабатываются, пробрасывается дальше
  - уровень компонента UI (Vue) - конечный этап, ошибка отлавливается, по надобности пользователю показывается
    уведомление. Для обработки используется функция `handleError(e, options)`, в опциях обязательно указывается `title`
    с названием действия `try { ... } catch (e) { handleError(e, { title: "Update user" }); }`
- **документирование кода**
  средствами JSDoc. Документированию подлежат:
  - переменные, если после инициализации тип значения будет отличаться от ткущего
  - функции и методы, если присутствует возвращаемое значение или аргумент
  - описание сущности, если поведение не очевидно
- **кроссплатформенный package.json**
  - для запуска команд в блоке `scripts` пакет `shx` для приведения к Unix-подобному синтаксису
  - для работы с переменными окружения используется пакет `cross-env`
  - для работы с архивами используется пакет `gzip-cli`
- **идентификация компонента и коллизии имён** - для лучшего ориентирования не только в файловой структуре, но и при
  отладке кода в таких инструментах как: Browser DevTools и VueDevtools, рекомендуется:
  - именовать vue файл в `kebab-case` пример `custom-component.vue`
  - именовать css файл в `kebab-case` пример `custom-component.css`
  - именовать js файл в `kebab-case` пример `custom-component.js`
  - html-класс в `kebab-case` пример `<div class="custom-component" />`
  - имя vue компонента в `CamelCase` пример `{ name: 'CustomComponent' }`
  - во избежание коллизии имён, для удобного поиска, понимания связи компонентов, использовать паттерн, где дочерний
    компонент в имени содержит префиксом имя родителя, пример:
  ```
  automation
  │
  ├───changes
  │       automation-changes.vue
  │       automation-changes-filter-panel.vue
  │       automation-changes-table.vue
  │
  ├───rule
  │   │   automation-rule-setup.vue
  │   │   automation-rule-setup-item.vue
  │   │
  │   ├───action
  │   │       automation-rule-action.vue
  │   │       automation-rule-action-simple.vue
  │   │
  │   └───threshold
  │           automation-rule-threshold.vue
  │
  └───rule-group
          automation-rule-group-list.vue
          automation-rule-group-list-item.vue
  ```
