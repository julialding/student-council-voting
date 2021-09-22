// This is the initial script that will take a few hours to run through and output AISD's entire database of people!
// This should be run annually; it will be used in all future voting activities.
// Run this in Google Scripts

function listAllUsers() {
    // Change spreadsheet ID to your ID!
    var ss1 = SpreadsheetApp.openById("1KEFjBxLkXpmu1v9Ow05RgZGB06iRrsK8szZpfQjdK7o").getSheetByName("Sheet1");
    // Change pageToken to page token of last filled row (in the first column). PageToken is a string, so make sure to add quotes
    var pageToken = "ClsKJPf-eReY_____6aWk5OWnpL_AP7__q_cmJybyJ7Mm83Kzcb__hDrxgQhzYrQJ-8bTXc5AAAAAGfohgFIAVAAWgsJUzxJUp88CxAQA2CdlpqcA3IGCLTUnooG";
    var page;
    // Change globalI to (last filled row)%100+1 (e.g. if last filled row is 6520, change to 6501)
    var globalI = 74601;
    var toSpreadsheet = [];
    do {
        page = AdminDirectory.Users.list({
            viewType: "domain_public",
            domain: 'stu.austinisd.org',
            orderBy: 'givenName',
            maxResults: 100,
            pageToken: pageToken
        });
        var users = page.users;
        if (users) {
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                toSpreadsheet.push(pageToken, user.name.fullName, user.primaryEmail, user.organizations);
                //Logger.log('%s (%s)', user.name.fullName, user.primaryEmail, user.organizations);
                var toSpreadsheetRange = ss1.getRange(globalI + i + 1, 1, 1, 4); //Indexing starts at 1! goes row, column, last row, last column
                toSpreadsheetRange.setValues([toSpreadsheet]);
                toSpreadsheet = [];
            }
        } else {
            Logger.log('No users found.');
        }
        globalI += 100;
        pageToken = page.nextPageToken;
    } while (pageToken);
}