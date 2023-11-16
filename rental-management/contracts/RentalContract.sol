// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

contract RentalContract {
    struct User {
        string userType; // Kullanıcı türü
        string name; // Kullanıcı adı
        string surname; // Kullanıcı soyadı
    }

    struct Complaint {
        address userAddress; // Şikayet eden kullanıcının adresi
        string description; // Şikayet nedeni
    }

    struct Property {
        address owner; // Mülk sahibi
        string propertyType; // Mülk türü (ev-dükkan)
        address lease; // Kiralama sözleşmesi
    }

    struct Lease {
        uint256 startDate; // Kira başlangıç tarihi
        uint256 endDate; // Kira bitiş tarihi
        bool isRented; // Kiralanmış mı
        bool isTerminated; // Kiralama sonlandırıldı mı
        address earlyTerminationRequestedBy; // Erken sonlandırma isteğinde bulunan kişi
    }

    mapping (address => User) public users;
    mapping (address => Property) public properties;
    mapping (address => Lease) public leases;
    Complaint[] public complaints;

    event UserRegistered(address indexed userAddress, string userType, string name, string surname);
    event ComplaintFiled(address indexed userAddress, string description);
    event PropertyAdded(address indexed propertyAddress, string propertyType, address owner);
    event LeaseStarted(address indexed propertyAddress, uint256 startDate, uint256 endDate);
    event LeaseTerminated(address indexed propertyAddress, address indexed earlyTerminationRequestedBy);

    // Kullanıcı kaydı
    function registerUser(string memory _userType, string memory _name, string memory _surname) public {
        require(bytes(users[msg.sender].userType).length == 0, "User already registered");
        User memory newUser = User({userType: _userType, name: _name, surname: _surname});
        users[msg.sender] = newUser;
    }

    // Kullanıcı bilgilerini getir
    function getUser() public view returns (string memory, string memory, string memory) {
        User storage currentUser = users[msg.sender];
        return (currentUser.userType, currentUser.name, currentUser.surname);
    }

    // Şikayet oluşturma
    function fileComplaint(string memory _description) public {
        complaints.push(Complaint(msg.sender, _description));
        emit ComplaintFiled(msg.sender, _description);
    }

    // Mülk oluşturma
    function addProperty(address _propertyAddress, string memory _propertyType) public {
        require(bytes(properties[_propertyAddress].propertyType).length == 0, "Property already exists");
        properties[_propertyAddress] = Property(msg.sender, _propertyType, address(0));
        emit PropertyAdded(_propertyAddress, _propertyType, msg.sender);
    }

    // Kiralama
    function startLease(address _propertyAddress, address _tenant, uint256 _startDate, uint256 _endDate) public {
        Property storage property = properties[_propertyAddress];
        require(property.owner == msg.sender, "Only property owner can start a lease");
        require(!leases[_propertyAddress].isRented, "Property is already rented");
        leases[_propertyAddress] = Lease(_startDate, _endDate, true, false, address(0));
        property.lease = _tenant;
        emit LeaseStarted(_propertyAddress, _startDate, _endDate);
    }

    // Erken kiralama sözleşmesi sonlandırma talebi
    function requestEarlyTermination(address _propertyAddress) public {
        Lease storage lease = leases[_propertyAddress];
        require(lease.isRented, "Property is not rented");
        require(lease.isTerminated == false, "Lease is already terminated");
        lease.earlyTerminationRequestedBy = msg.sender;
    }

    // Kiralama sözleşmesini sonlandırma
    function terminateLease(address _propertyAddress) public {
        Property storage property = properties[_propertyAddress];
        Lease storage lease = leases[_propertyAddress];
        require(property.owner == msg.sender, "Only property owner can terminate the lease");
        require(lease.isRented, "Property is not rented");
        require(lease.isTerminated == false, "Lease is already terminated");
        if (lease.earlyTerminationRequestedBy != address(0)) {
            require(lease.earlyTerminationRequestedBy == msg.sender, "Only the user who requested early termination can terminate the lease");
        }
        lease.isRented = false;
        lease.isTerminated = true;
        emit LeaseTerminated(_propertyAddress, lease.earlyTerminationRequestedBy);
    }
}