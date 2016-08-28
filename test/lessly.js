import chai from 'chai';
import lessly, {colorFunctions, fade, theme} from '../src/lessly';
import functionArgs from './functions';
const {assert} = chai;

export default function () {

  describe('should work with colors', function () {

    function nearEqual(val1, val2) {
      const variance = 10000000;
      assert.equal(Math.round(Math.round(val1 * variance)/variance), Math.round(Math.round(val2 * variance)/variance));
    }
    it('import lessly', function() {
      assert.isOk(lessly);
    });
    it('parse color', function() {
      let color = lessly('fade(rgb(0, 0, 0), 90%)');
      assert.equal(color, 'rgba(0, 0, 0, 0.9)');

      color = lessly('fade(black, 90%)');
      assert.equal(color, 'rgba(0, 0, 0, 0.9)');
    });
    
    it('swaps vars', function() {
      let color = lessly('fade(@myblack, 90%)', {myblack: 'rgb(0,0,0)'});
      assert.equal(color, 'rgba(0, 0, 0, 0.9)');

      color = lessly('fade(@my-black, 90%)', {myBlack: 'rgb(0,0,0)'});
      assert.equal(color, 'rgba(0, 0, 0, 0.9)');
    });

    it('supports theme', function() {
      let lesslyTheme = theme({myPink: '#FFB6C1'});
      assert.equal(lesslyTheme('fade(@my-pink, 90%)'), 'rgba(255, 182, 193, 0.9)');
      assert.equal(lesslyTheme.fade('@my-pink', 90), 'rgba(255, 182, 193, 0.9)');
    });

    it('standalone functions', function() {
      let color = colorFunctions.fade('black', '90%');
      assert.equal(color, 'rgba(0, 0, 0, 0.9)');
      assert.equal(colorFunctions.fade('black', '90%'), lessly('fade(black,90%)'));
      assert.equal(fade('black', '90%'), lessly('fade(black,90%)'));
    });

    

    Object.keys(colorFunctions).forEach(key => {

      const func = colorFunctions[key];
      const testCase = functionArgs[key];
      if (testCase) {
        it(`Supports ${key}`, function() {
          let [args, result] = testCase;
          assert.equal(func(...args), lessly(`${key}(${args.join(',')})`));
          if (result) {
            if(result.indexOf && result.indexOf('%') > -1) {
              nearEqual(Number(func(...args).replace(/%$/, '')), Number(result.replace(/%$/, '')));
            } else if (isNaN(result)) {
              assert.equal(func(...args).replace(/\s/g, ''), result.replace(/\s/g, ''));
            } else {
              nearEqual(func(...args), result);
            }
          }
        });
      }
    });

  });
}
