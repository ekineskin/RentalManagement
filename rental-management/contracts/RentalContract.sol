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
        string publicAddress; // Mülk adresi
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
    address[] private propertyOwners;

    event UserRegistered(address indexed userAddress, string userType, string name, string surname);
    event ComplaintFiled(address indexed userAddress, string description);
    event PropertyAdded(address indexed propertyAddress, string propertyType, string publicAddress, address owner);
    event LeaseStarted(address indexed propertyAddress, uint256 startDate, uint256 endDate);
    event LeaseTerminated(address indexed propertyAddress, address indexed earlyTerminationRequestedBy);

    // Kullanıcı kaydı
    function registerUser(string memory _userType, string memory _name, string memory _surname) public {
        require(bytes(users[msg.sender].userType).length == 0, "User already registered");
        User memory newUser = User({userType: _userType, name: _name, surname: _surname});
        users[msg.sender] = newUser;
    }

    // Şikayet oluşturma
    function fileComplaint(string memory _description) public {
        complaints.push(Complaint(msg.sender, _description));
        emit ComplaintFiled(msg.sender, _description);
    }

    // Mülk oluşturma
    function addProperty(address _propertyAddress, string memory _propertyType, string memory _publicAddress) public {
        require(bytes(properties[_propertyAddress].propertyType).length == 0, "Property already exists");

        // Mülk sahibini ve mülkü ekle
        propertyOwners.push(msg.sender);
        properties[msg.sender] = Property(msg.sender, _propertyType, _publicAddress, address(0));
        emit PropertyAdded(_propertyAddress, _propertyType, _publicAddress, msg.sender);
    }

    // Kullanıcının sahip olduğu tüm mülkleri getir
    function getUserProperties() public view returns (Property[] memory) {
        require(bytes(users[msg.sender].userType).length > 0, "User not registered");

        // Kullanıcının sahip olduğu mülkleri tutacak dizi
        Property[] memory userProperties = new Property[](propertyOwners.length);
        uint256 counter = 0;

        // Tüm mülk sahiplerini dön
        for (uint256 i = 0; i < propertyOwners.length; i++) {
            address propertyOwner = propertyOwners[i];

            // Eğer mülk sahibi kullanıcı ise
            if (propertyOwner == msg.sender) {
                // Kullanıcının sahip olduğu mülkü listeye ekle
                userProperties[counter] = properties[propertyOwner];
                counter++;
            }
        }

        // Gerçek boyutta bir dizi oluştur ve kullanıcının mülklerini kopyala
        Property[] memory result = new Property[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = userProperties[i];
        }

        return result;
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