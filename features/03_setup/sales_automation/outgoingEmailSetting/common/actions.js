const assert = require('assert');
const {until} = require('selenium-webdriver');
const commonElementObj = require('../../../../00_common/webElements/commonElements');
const openSalesmatePageObj = require('../../../../00_common/actions/openSalesmatePage');
const performSalesmateLoginObj = require('../../../../00_common/actions/performSalesmateLogin');
const readUserDetailsObj = require('../../../../00_common/actions/readExcelData');
const moduleElementsObj = require('../../../../00_common/webElements/moduleElements');
const screenshotObj = require('../../../../00_common/actions/browserActions/takeScreenshot');

//will navigate on the dashboard page and then come back to the outgoing email setting page
async function comeBackToOutgoingEmailSettingPage(driver,screenshotPath){
    const contactModule = await moduleElementsObj.findModuleIcon(driver,'icon-ic_contacts');
    await contactModule.click();
    await driver.sleep(2000);
    await openSalesmatePageObj.openSetupPage(driver,screenshotPath);
    const outgoingEmailSettingTab = await commonElementObj.findSetupSubmenuBtn(driver,screenshotPath,' Email Delivery ');
    await driver.executeScript("arguments[0].scrollIntoView();",outgoingEmailSettingTab[0]);
    await driver.wait(until.elementIsVisible(outgoingEmailSettingTab[0]));
    await outgoingEmailSettingTab[0].click();
    await driver.sleep(3000);
    await driver.wait(until.urlContains('email-delivery/outgoing-setting'),10000);
}exports.comeBackToOutgoingEmailSettingPage=comeBackToOutgoingEmailSettingPage;

async function openOutgoingEmailSettingPage(driver,screenshotPath) {
    //will open the 'Setup' page
    await openSalesmatePageObj.openSetupPage(driver,screenshotPath);
    //will find the 'Outgoing Email Setting' tab
    const outgoingEmailSettingTab = await commonElementObj.findSetupSubmenuBtn(driver,screenshotPath,' Email Delivery ');

    //will check the 'Outgoing Email Setting' tab is visible or not
    if(outgoingEmailSettingTab.length > 0){
        //will set focus on the 'Outgoing Email Setting' tab
        await driver.executeScript("arguments[0].scrollIntoView();",outgoingEmailSettingTab[0]);
        await driver.wait(until.elementIsVisible(outgoingEmailSettingTab[0]));
        //will click on the 'Outgoing Email Setting' tab
        await outgoingEmailSettingTab[0].click();
    }else{
        /* As 'Outgoing Email Setting' tab is not visible to the logged-in user, it will do Admin login on the same browser */

        let adminUserNumber = '';

        //will get the Admin user details from the xlsx file
        const userDetails = await readUserDetailsObj.readUserDetails('./cucumber_config/testData_dev.xlsx','UserDetails');
        for(let i=0; i<userDetails.user.length; i++){
            if(userDetails.profile[i].toLowerCase() == 'admin'){
                adminUserNumber = userDetails.user[i];
            }
        }
        //will check whether the Admin user found or not from the excel file
        if(adminUserNumber == ''){
            await assert.fail('Due to the Admin profile user is not found from the excel file, the test case has been aborted. Found Profiles ---> \''+userDetails.profile+'\'.');
        }

        //will open the Salesmate login page
        await openSalesmatePageObj.openSalesmateLoginPage(driver,screenshotPath,'the {string} is on outgoing email setting page');
        //will do Salesmate login with Admin user's credentials
        await performSalesmateLoginObj.performSalesmateLogin(driver,screenshotPath,adminUserNumber,'the {string} is on outgoing email setting page');
        //will open the 'Setup' page
        await openSalesmatePageObj.openSetupPage(driver,screenshotPath);
        //will find the 'Outgoing Email Setting' tab
        const outgoingEmailSettingTab = await commonElementObj.findSetupSubmenuBtn(driver,screenshotPath,' Email Delivery ');
        //will set focus on the 'Outgoing Email Setting' tab
        await driver.executeScript("arguments[0].scrollIntoView();",outgoingEmailSettingTab[0]);
        await driver.wait(until.elementIsVisible(outgoingEmailSettingTab[0]));
        //will click on the 'Outgoing Email Setting' tab
        await outgoingEmailSettingTab[0].click();
    }
    await driver.sleep(2000);

    //will verify whether the outgoing email setting page found or not
    try{
        await driver.wait(until.urlContains('email-delivery/outgoing-setting'),10000);
    }catch(err){
        await screenshotObj.takeScreenshot(driver,screenshotPath+'outgoingEmailSetting_NotFound.png');
        await assert.fail('Due to the outgoing email setting page is not found, the test case has been failed. Error Details: \''+err+'\' Screenshot Name: \''+screenshotPath+'outgoingEmailSetting_NotFound.png\'.');
    }
    console.log('The outgoing email setting page has been opened successfully...');
}exports.openOutgoingEmailSettingPage=openOutgoingEmailSettingPage;