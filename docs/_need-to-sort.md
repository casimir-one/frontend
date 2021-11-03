## Соглашения

- **именование методов, функций обработки событий** - по схеме `handle[triger][event]()`:
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
      methods: {
        handleAddItemBtnClick() {},
        handleSimpleListItemDelete(index) {}
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
- **идентификация компонента и коллизии имён** - для лучшего ориентирования в файловой структуре проекта и во избежание коллизии имён и возможности лёгкого масштабирования проекта рекомендуется использовать паттерн, где дочерний компонент в имени содержит префиксом имя родителя, пример:
  ```
  automation
  │
  ├───changes
  │       AutomationChanges.vue
  │       AutomationChangesFilterPanel.vue
  │       AutomationChangesTable.vue
  │
  ├───rule
  │   │   AutomationRuleSetup.vue
  │   │   AutomationRuleSetupItem.vue
  │   │
  │   ├───action
  │   │       AutomationRuleAction.vue
  │   │       AutomationRuleActionSimple.vue
  │   │
  │   └───threshold
  │           AutomationRuleThreshold.vue
  │
  └───rule-group
          AutomationRuleGroupList.vue
          AutomationRuleGroupListItem.vue
  ```
  Так же, для ускорения отладки в DevTools Elements, если компонент имеет html-шаблон, должно быть прописано имя селектора для обёртки и совпадать с названием компонента, даже если обёртка элемент библиотеки, пример:
  ```vue
    <templte>
      <v-container class="automation-changes"> content </v-container>
    </templte>
    <script>
      // AutomationChanges.vue
      export default {
        name: "AutomationChanges"
      }
    </script>
  ```
