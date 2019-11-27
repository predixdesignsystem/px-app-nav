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

import 'px-icon-set/px-icon.js';
import 'px-icon-set/px-icon-set.js';
import './px-app-nav-behaviors.js';
import './css/px-app-nav-item-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
    <style include="px-app-nav-item-styles"></style>

    <template is="dom-if" if="{{_propIsTypeOf(icon, 'string')}}">
      <px-icon class\$="app-nav-item__icon {{_addClassIfHasLabel(label)}}" icon="{{icon}}"></px-icon>
    </template>

    <template is="dom-if" if="{{emptyIcon}}">
      <div class="app-nav-item__icon app-nav-item__icon--with-label app-nav-item__icon--empty"></div>
    </template>
    <template is="dom-if" if="{{emptyLabel}}">
      <div class="app-nav-item__label app-nav-item__label--empty"></div>
    </template>

    <template is="dom-if" if="{{_propIsTypeOf(label, 'string')}}">
      <p title="[[label]]" class="app-nav-item__label">{{label}}</p>
    </template>

    <template is="dom-if" if="{{empty}}">
      <div class="app-nav-item__icon app-nav-item__icon--with-label app-nav-item__icon--empty"></div>
      <div class="app-nav-item__label app-nav-item__label--empty"></div>
    </template>

    <template is="dom-if" if="{{dropdown}}">
      <px-icon class="app-nav-item__dropdown-icon" icon="px-utl:chevron"></px-icon>
    </template>
`,

  is: 'px-app-nav-item',
  behaviors: [PxAppNavBehavior.Item],

  properties: {
    /**
     * Used to set the icon for the item.
     */
    icon: {
      type: String
    },

    /**
     * Set to `true` if this is a subitem.
     */
    subitem: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Shows a dropdown arrow icon to indicate this item can be tapped to
     * open a subgroup.
     */
    dropdown: {
      type: Boolean,
      value: false
    },

    /**
     * Set to `true` if the item is inside a overflowed dropdown.
     */
    overflowed: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: 'updateStyles' // Necessary to ensure correct style scoping for px-icon
    },

    /**
     * Shows an empty state outline for icon.
     */
    emptyIcon: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * Shows an empty state outline for the label.
     */
    emptyLabel: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  /**
   * If an item has an icon and a label, get class to add margin between them.
   */
  _addClassIfHasLabel(labelStr) {
    return (typeof labelStr === 'string' && labelStr.length) ? 'app-nav-item__icon--with-label' : '';
  }
});
