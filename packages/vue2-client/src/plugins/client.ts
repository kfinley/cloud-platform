// Loaded once per applicaiton. Required for dependency injection
import "reflect-metadata";

import Vue, { PluginFunction, PluginObject } from "vue";
import { Store } from "vuex";
import router from "vue-router";
import VuexPersist from "vuex-persist";
import { getModule } from 'vuex-module-decorators';
import { extend } from 'vee-validate';
import { RouteNames } from "../router";
import { setupValidation } from '@cloud-platform/vue2-components-plugin/src/validation';
import { NotificationPlugin } from "@cloud-platform/vue2-notify-plugin/src";
// import { WebSocketsPlugin } from "@cloud-platform/vue2-websockets/src";
// import { WebSocketsModule } from '@cloud-platform/vue2-websockets/src/store/webSocketsModule';
import { UserPlugin } from "@cloud-platform/vue2-user-plugin/src";
import { RegistrationModule, UserModule } from '@cloud-platform/vue2-user-plugin/src/store/store-modules';
import { NotificationState } from '@cloud-platform/vue2-notify-plugin/src/store';
import { UserState, RegistrationState } from '@cloud-platform/vue2-user-plugin/src/store';
//import { config } from '@cloud-platform/src/config';

import "bootstrap/dist/css/bootstrap.css";
import "@cloud-platform/vue2-components-plugin/src/styles/styles.scss";

export interface ClientPlugin extends PluginObject<ClientPluginOptions> {
  install: PluginFunction<ClientPluginOptions>;
}

export interface ClientPluginOptions {
  appName: string;
  router: router;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  store: Store<any>;
}

const plugin = {
  install(vue: typeof Vue, options?: ClientPluginOptions) {
    if (options !== undefined && options.router && options.store) {
      const appName = options.appName ?? "Client";

      vue.use(NotificationPlugin, {
        router: options.router,
        store: options.store,
      });

      vue.use(UserPlugin, {
        router: options.router,
        store: options.store,
        LoginRedirectRouteName: RouteNames.Dashboard,
        DefaultRoute: RouteNames.Home
      });

      //   vue.use(WebSocketsPlugin, {
      //     router: options.router,
      //     store: options.store,
      //     connectOnChangedGetter: () => (<UserState>options.store.state.User).authStatus,
      //     connectOnChangedValue: AuthStatus.LoggedIn,
      //     url: `${config.WebSocket}:${config.WebSocketPort}`
      //   });

      //HACK: Calls to Vuex.registerModule inside plugins will wipe out the store getters.
      //      so we must call getModule for any module that got wiped out.
      //      https://github.com/vuejs/vuex/blob/d65d14276e87aca17cfbd3fbf4af9e8dbb808f24/src/store.js#L265
      //      https://github.com/championswimmer/vuex-module-decorators/issues/250
      //
      //   getModule(WebSocketsModule, options.store);
      getModule(UserModule, options.store);
      getModule(RegistrationModule, options.store);

      setupValidation(extend);

      // router provided to add any plugin routes.
      // i.e. options.router.addRoutes(routes);

      const vuexLocalStorage = new VuexPersist({
        key: appName, // The key to store the state on in the storage provider.
        storage: window.localStorage, // or window.sessionStorage or localForage
        // Function that passes the state and returns the state with only the objects you want to store.
        reducer: (state: { Notification: NotificationState, Registration: RegistrationState, User: UserState }) => ({
          User: {
            authTokens: state.User.authTokens,
            currentUser: state.User.currentUser
          }
        }),
        // Function that passes a mutation and lets you decide if it should update the state in localStorage.
        // filter: (mutation) => true
      });

      vuexLocalStorage.plugin(options.store);

    }
  },
};

export default plugin as ClientPlugin;