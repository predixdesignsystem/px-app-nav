/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-app-nav-behaviors.js';
import './css/px-app-nav-subitem-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="px-app-nav-subitem-styles"></style>

    <template is="dom-if" if="{{_propIsTypeOf(label, 'string')}}">
      <p title="[[label]]" class="app-nav-subitem__label">{{label}}</p>
    </template>
`,

  is: 'px-app-nav-subitem',
  behaviors: [PxAppNavBehavior.Item],

  properties: {
    /**
     * Set to `true` if the subitem's parent is selected.
     */
    parentSelected: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: 'updateStyles'
    }
  }
});
