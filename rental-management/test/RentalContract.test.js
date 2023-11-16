// SPDX-License-Identifier: MIT
const RentalContract = artifacts.require("RentalContract");

contract("RentalContract", (accounts) => {
  let rentalContract;

  beforeEach(async () => {
    rentalContract = await RentalContract.new();
  });

  it("should register a user", async () => {
    const userType = "Tenant";
    const name = "Ekin";
    const surname = "Eskin";

    await rentalContract.registerUser(userType, name, surname, { from: accounts[0] });

    const user = await rentalContract.users(accounts[0]);

    assert.equal(user.userType, userType, "User type is incorrect");
    assert.equal(user.name, name, "Name is incorrect");
    assert.equal(user.surname, surname, "Surname is incorrect");
  });

  it("should file a complaint", async () => {
    const description = "The property has issues.";

    await rentalContract.fileComplaint(description, { from: accounts[1] });

    const complaint = await rentalContract.complaints(0);

    assert.equal(complaint.userAddress, accounts[1], "User address is incorrect");
    assert.equal(complaint.description, description, "Complaint description is incorrect");
  });

  it("should add a property", async () => {
    const propertyAddress = accounts[1];
    const propertyType = "House";

    await rentalContract.addProperty(propertyAddress, propertyType, { from: accounts[1] });

    const property = await rentalContract.properties(propertyAddress);

    assert.equal(property.owner, accounts[1], "Property owner is incorrect");
    assert.equal(property.propertyType, propertyType, "Property type is incorrect");
  });

  it("should start a lease", async () => {
    const propertyAddress = accounts[1];
    const tenant = accounts[2];
    const startDate = 1234567890;
    const endDate = 1234569999;

    await rentalContract.addProperty(propertyAddress, "House", { from: accounts[2] });
    await rentalContract.startLease(propertyAddress, tenant, startDate, endDate, { from: accounts[2] });

    const lease = await rentalContract.leases(propertyAddress);

    assert.equal(lease.isRented, true, "Property is not rented");
    assert.equal(lease.earlyTerminationRequestedBy, "0x0000000000000000000000000000000000000000", "Early termination request is incorrect");
  });
});
