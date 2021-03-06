import { expect } from 'chai';
import rtl from './main';

const { create, sheets } = require('jss');

describe('jss-rtl', () => {
  let jss: any;

  beforeEach(() => {
    jss = create().use(rtl());
  });

  afterEach(() => {
    sheets.registry.forEach((sheet: any) => sheet.detach());
    sheets.reset();
  });

  describe('simple usage', () => {
    let sheet: any;

    beforeEach(() => {
      sheet = jss.createStyleSheet({ a: { 'padding-left': '1px' } });
    });

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.be.ok;
    });

    it('should generate correct CSS', () => {
      expect(sheet.toString()).to.be.equals([
        '.a-0-1 {',
        '  padding-right: 1px;',
        '}',
      ].join('\n'));
    });

  });

  describe('global enable', () => {
    let sheet: any;

    beforeEach(() => {
      jss = create().use(rtl({ enabled: false }));
      sheet = jss.createStyleSheet({ a: { 'padding-left': '1px' } });
    });

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.be.ok;
    });

    it('should generate unchanged CSS', () => {
      expect(sheet.toString()).to.be.equals([
        '.a-0-1 {',
        '  padding-left: 1px;',
        '}',
      ].join('\n'));
    });

    it('should remove the flip property from the style even when disabled', () => {
      sheet = jss.createStyleSheet({ a: { flip: true, 'padding-left': '1px' } });
      expect(sheet.toString()).to.be.equals([
        '.a-0-2 {',
        '  padding-left: 1px;',
        '}',
      ].join('\n'));
    });

  });

  describe('create stylesheet opt-out', () => {
    let sheet: any;

    beforeEach(() => {
      sheet = jss.createStyleSheet({ a: { 'padding-left': '1px' } }, { flip: false });
    });

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.be.ok;
    });

    it('should generate unchanged CSS', () => {
      expect(sheet.toString()).to.be.equals([
        '.a-0-1 {',
        '  padding-left: 1px;',
        '}',
      ].join('\n'));
    });

  });

  describe('rule opt-out', () => {
    let sheet: any;

    beforeEach(() => {
      sheet = jss.createStyleSheet({
        a: { 'padding-left': '1px' },
        b: { flip: false, 'padding-left': '1px' },
      });
    });

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.be.ok;
      expect(sheet.getRule('b')).to.be.ok;
    });

    it('should generate unchanged CSS and remove the flip prop', () => {
      expect(sheet.toString()).to.be.equals([
        '.a-0-1 {',
        '  padding-right: 1px;',
        '}',
        '.b-0-2 {',
        '  padding-left: 1px;',
        '}',
      ].join('\n'));
    });

  });

  describe('rule opt-in', () => {
    let sheet: any;

    beforeEach(() => {
      jss = create().use(rtl({ opt: 'in' }));
      sheet = jss.createStyleSheet({
        a: { 'padding-left': '1px' },
        b: { flip: true, 'padding-left': '1px' },
      });
    });

    it('should add rules', () => {
      expect(sheet.getRule('a')).to.be.ok;
      expect(sheet.getRule('b')).to.be.ok;
    });

    it('should generate changed CSS and remove the flip prop', () => {
      expect(sheet.toString()).to.be.equals([
        '.a-0-1 {',
        '  padding-left: 1px;',
        '}',
        '.b-0-2 {',
        '  padding-right: 1px;',
        '}',
      ].join('\n'));
    });

  });

});
