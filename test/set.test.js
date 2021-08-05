let assert = require("assert");
let SettingsBill = require("../setting-bill");


describe('Setting Bill Factory Function', function(){
    it('should be able to set call costs', function(){


      let settingBill = SettingsBill();

      settingBill.setSettings({
          callCost : 2.75,
      
      })

        assert.equal(settingBill.getSettings().callCost, 2.75);

    });

    it('should be able to set sms costs', function(){


        let settingBill = SettingsBill();
  
        settingBill.setSettings({
            smsCost : 0.75,
        
        })
  
          assert.equal(settingBill.getSettings().smsCost, 0.75);
  
      });

      it('should be able to set warning level', function(){


        let settingBill = SettingsBill();
  
        settingBill.setSettings({
            warningLevel : 30.00,
        
        })
  
          assert.equal(settingBill.getSettings().warningLevel, 30.00);
  
      });

      it('should be able to set critical level', function(){


        let settingBill = SettingsBill();
  
        settingBill.setSettings({
            criticalLevel : 50.00,
        
        })
  
          assert.equal(settingBill.getSettings().criticalLevel, 50.00);
  
      });

    it('should be able to get total costs', function(){

        let settingBill = SettingsBill();

        settingBill.setSettings({
            callCost : 2.75,
            smsCost : 0.75,
            warningLevel : 30,
            criticalLevel : 50
        })
  
        settingBill.recordAction('call');
        settingBill.recordAction('sms');
  
        
        assert.equal(2.75, settingBill.totals().callTotal);
        assert.equal(0.75, settingBill.totals().smsTotal);
        assert.equal(3.50, settingBill.totals().grandTotal);
    });

    it('should be able to calculate two calls and three smses', function(){

        let settingBill = SettingsBill();

        settingBill.setSettings({
            callCost : 2.75,
            smsCost : 0.75,
            warningLevel : 30,
            criticalLevel : 50
        })
  
        settingBill.recordAction('call');
        settingBill.recordAction('call');
        settingBill.recordAction('call');
        settingBill.recordAction('sms');
        settingBill.recordAction('sms');
  
        
        assert.equal(8.25, settingBill.totals().callTotal);
        assert.equal(1.5, settingBill.totals().smsTotal);
        assert.equal(9.75, settingBill.totals().grandTotal);

    });

    it('should be able to change color to orange when the warning level is reached', function(){

        let settingBill = SettingsBill();
        settingBill.setSettings({
            smsCost: 2.75,
            callCost: 0.75,
            warningLevel: 3.5,
            criticalLevel: 15
        });

        settingBill.recordAction('call');
        settingBill.recordAction('sms');
      
        assert.equal(true, settingBill.hasReachedWarningLevel());
       
    });

    it('should be able to change color to red when the critical level is reached', function(){

        let settingBill = SettingsBill();

        settingBill.setSettings({
            smsCost: 2.75,
            callCost: 0.75,
            warningLevel: 3.5,
            criticalLevel: 7
        });

        settingBill.recordAction('call');
        settingBill.recordAction('call');
        settingBill.recordAction('sms');
        settingBill.recordAction('sms');
      
        assert.equal(true, settingBill.hasReachedCriticalLevel());
       
    });

   
})




