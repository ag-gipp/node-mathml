/* eslint-disable no-param-reassign */

'use strict';

const mml = require('./MathMLReader');
const opMap = require('./operationMap');
const pako = require('pako');
const base64url = require('base64url');

const conf = require('../config.js');

mml.base.prototype.imgUrl = function(format:string|boolean = false) {
  /**
   * @return {string}
   */
  function toMML(mml:string) {
    mml =    `<math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">${mml}</math>`;
    return base64url(pako.deflate(mml));
  }

  let node = this.first();
  if (format === false) {
    format = this.expansion;
  }
  if (format === 'first' && this.name() === 'apply') {
    node = this.children().first();
  }
  const collapsedApply = format === 'collapsed' && this.name() === 'apply';
  if (!collapsedApply && opMap.hasOwnProperty(node.name())) {
    node = opMap[node.name()];
  } else {
    node = node.refNode();
  }
  const mml = toMML(node.toString());
  return `${conf.get('mathoidUrl')}/zlib/svg/mml/${encodeURIComponent(mml)}`;
};

module.exports = mml;

