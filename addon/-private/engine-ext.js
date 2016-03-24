import Ember from 'ember';
import emberRequire from './ext-require';

//const SelectView = emberRequire('ember-views/views/select');
const EmberView = emberRequire('ember-views/views/view');
const RoutingService = emberRequire('ember-routing/services/routing');
const Engine = emberRequire('ember-application/system/engine');

const {
  OutletView,
  TextField,
  TextArea,
  Checkbox,
  ContainerDebugAdapter,
  ComponentLookup,
  LinkComponent
} = Ember;

Engine.reopen({
  buildRegistry() {
    let namespace = this;
    let registry = this._super(...arguments);

    if (!(this instanceof Ember.Application)) {
      registry.optionsForType('component', { singleton: false });
      registry.optionsForType('view', { singleton: false });
      registry.optionsForType('template', { instantiate: false });

      registry.register('application:main', namespace, { instantiate: false });

      registry.register('controller:basic', Ember.Controller, { instantiate: false });

      // registry.register('renderer:-dom', { create() { return new Renderer(new DOMHelper()); } });

      registry.injection('view', 'renderer', 'renderer:-dom');

      // if (Ember.ENV._ENABLE_LEGACY_VIEW_SUPPORT) {
      //  registry.register('view:select', SelectView);
      // }
      registry.register('view:-outlet', OutletView);

      //registry.register('-view-registry:main', { create() { return {}; } });

      registry.injection('view', '_viewRegistry', '-view-registry:main');

      registry.register('view:toplevel', EmberView.extend());

      // registry.register('route:basic', Route, { instantiate: false });
      // registry.register('event_dispatcher:main', EventDispatcher);

      // registry.injection('router:main', 'namespace', 'application:main');
      registry.injection('view:-outlet', 'namespace', 'application:main');

      // registry.register('location:auto', AutoLocation);
      // registry.register('location:hash', HashLocation);
      // registry.register('location:history', HistoryLocation);
      // registry.register('location:none', NoneLocation);

      registry.injection('controller', 'target', 'router:main');
      registry.injection('controller', 'namespace', 'application:main');

      // registry.register('-bucket-cache:main', BucketCache);
      registry.injection('router', '_bucketCache', '-bucket-cache:main');
      registry.injection('route', '_bucketCache', '-bucket-cache:main');
      registry.injection('controller', '_bucketCache', '-bucket-cache:main');

      registry.injection('route', 'router', 'router:main');

      registry.register('component:-text-field', TextField);
      registry.register('component:-text-area', TextArea);
      registry.register('component:-checkbox', Checkbox);
      // registry.register('view:-legacy-each', LegacyEachView);
      registry.register('component:link-to', LinkComponent);

      // Register the routing service...
      registry.register('service:-routing', RoutingService);
      // Then inject the app router into it
      registry.injection('service:-routing', 'router', 'router:main');

      // DEBUGGING
      registry.register('resolver-for-debugging:main', registry.resolver, { instantiate: false });
      registry.injection('container-debug-adapter:main', 'resolver', 'resolver-for-debugging:main');
      registry.injection('data-adapter:main', 'containerDebugAdapter', 'container-debug-adapter:main');
      // Custom resolver authors may want to register their own ContainerDebugAdapter with this key

      registry.register('container-debug-adapter:main', ContainerDebugAdapter);

      registry.register('component-lookup:main', ComponentLookup);
    }

    return registry;
  }
});
