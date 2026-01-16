// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateVerification {
    
    address public admin;
    string public institutePassword;
    uint256 public totalCertificates;
    uint256 public totalStudents;
    
    struct Student {
        string enrollmentNumber;
        string name;
        string email;
        string phone;
        string photoHash;
        bool isRegistered;
        uint256 registeredAt;
    }
    
    struct Certificate {
        string certificateHash;
        string enrollmentNumber;
        string studentName;
        string course;
        string grade;
        uint256 year;
        string pdfHash;
        string photoHash;
        address issuer;
        uint256 issuedAt;
        bool isValid;
    }
    
    mapping(string => Student) private students;
    mapping(string => Certificate) private certificates;
    mapping(string => string[]) private studentCertificates;
    string[] private allCertificateHashes;
    string[] private allEnrollmentNumbers;
    
    event StudentRegistered(string enrollmentNumber, string name, address registeredBy, uint256 timestamp);
    event CertificateIssued(string certificateHash, string enrollmentNumber, string studentName, string course, address issuer, uint256 timestamp);
    event CertificateRevoked(string certificateHash, address revokedBy, uint256 timestamp);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    constructor(string memory _institutePassword) {
        admin = msg.sender;
        institutePassword = _institutePassword;
    }
    
    function registerStudent(
        string memory _enrollmentNumber,
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _photoHash
    ) public onlyAdmin {
        require(!students[_enrollmentNumber].isRegistered, "Student already registered");
        require(bytes(_enrollmentNumber).length > 0, "Enrollment number required");
        
        students[_enrollmentNumber] = Student({
            enrollmentNumber: _enrollmentNumber,
            name: _name,
            email: _email,
            phone: _phone,
            photoHash: _photoHash,
            isRegistered: true,
            registeredAt: block.timestamp
        });
        
        allEnrollmentNumbers.push(_enrollmentNumber);
        totalStudents++;
        
        emit StudentRegistered(_enrollmentNumber, _name, msg.sender, block.timestamp);
    }
    
    function issueCertificate(
        string memory _certificateHash,
        string memory _enrollmentNumber,
        string memory _studentName,
        string memory _course,
        string memory _grade,
        uint256 _year,
        string memory _pdfHash,
        string memory _photoHash
    ) public onlyAdmin {
        require(bytes(_certificateHash).length > 0, "Certificate hash required");
        require(!certificates[_certificateHash].isValid, "Certificate hash already exists");
        require(students[_enrollmentNumber].isRegistered, "Student not registered");
        
        certificates[_certificateHash] = Certificate({
            certificateHash: _certificateHash,
            enrollmentNumber: _enrollmentNumber,
            studentName: _studentName,
            course: _course,
            grade: _grade,
            year: _year,
            pdfHash: _pdfHash,
            photoHash: _photoHash,
            issuer: msg.sender,
            issuedAt: block.timestamp,
            isValid: true
        });
        
        studentCertificates[_enrollmentNumber].push(_certificateHash);
        allCertificateHashes.push(_certificateHash);
        totalCertificates++;
        
        emit CertificateIssued(_certificateHash, _enrollmentNumber, _studentName, _course, msg.sender, block.timestamp);
    }
    
    function revokeCertificate(string memory _certificateHash) public onlyAdmin {
        require(certificates[_certificateHash].isValid, "Certificate not found");
        certificates[_certificateHash].isValid = false;
        emit CertificateRevoked(_certificateHash, msg.sender, block.timestamp);
    }
    
    function updateInstitutePassword(string memory _newPassword) public onlyAdmin {
        institutePassword = _newPassword;
    }
    
    function verifyCertificate(string memory _certificateHash) public view returns (bool) {
        return certificates[_certificateHash].isValid;
    }
    
    function getCertificate(string memory _certificateHash) public view returns (
        string memory studentName,
        string memory course,
        string memory grade,
        uint256 year,
        string memory enrollmentNumber,
        address issuer,
        uint256 issuedAt,
        string memory pdfHash,
        string memory photoHash,
        bool isValid
    ) {
        Certificate memory cert = certificates[_certificateHash];
        return (cert.studentName, cert.course, cert.grade, cert.year, cert.enrollmentNumber, cert.issuer, cert.issuedAt, cert.pdfHash, cert.photoHash, cert.isValid);
    }
    
    function getStudent(string memory _enrollmentNumber) public view returns (
        string memory name,
        string memory email,
        string memory phone,
        string memory photoHash,
        bool isRegistered,
        uint256 registeredAt
    ) {
        Student memory s = students[_enrollmentNumber];
        return (s.name, s.email, s.phone, s.photoHash, s.isRegistered, s.registeredAt);
    }
    
    function isStudentRegistered(string memory _enrollmentNumber) public view returns (bool) {
        return students[_enrollmentNumber].isRegistered;
    }
    
    function authenticateStudent(string memory _enrollmentNumber, string memory _password) public view returns (bool) {
        if (!students[_enrollmentNumber].isRegistered) return false;
        return keccak256(bytes(_password)) == keccak256(bytes(institutePassword));
    }
    
    function getStudentCertificates(string memory _enrollmentNumber) public view returns (string[] memory) {
        return studentCertificates[_enrollmentNumber];
    }
    
    function getTotalCertificates() public view returns (uint256) { return totalCertificates; }
    function getTotalStudents() public view returns (uint256) { return totalStudents; }
    function getAllCertificateHashes() public view returns (string[] memory) { return allCertificateHashes; }
    function getAllEnrollmentNumbers() public view returns (string[] memory) { return allEnrollmentNumbers; }
    function getAdmin() public view returns (address) { return admin; }
    
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
