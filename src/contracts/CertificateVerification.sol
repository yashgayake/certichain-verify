// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CertificateVerification
 * @dev Blockchain-based Certificate Verification System
 * @notice This contract manages student registration, certificate issuance, and verification
 */
contract CertificateVerification {
    
    // ============ STATE VARIABLES ============
    
    address public admin;
    string public institutePassword; // Password for student login (e.g., "0777")
    uint256 public totalCertificates;
    uint256 public totalStudents;
    
    // ============ STRUCTS ============
    
    struct Student {
        string enrollmentNumber;
        string name;
        string email;
        string phone;
        string photoHash;      // IPFS hash or base64 of student photo
        bool isRegistered;
        uint256 registeredAt;
    }
    
    struct Certificate {
        string certificateHash;     // Unique certificate hash (primary key)
        string enrollmentNumber;    // Link to student
        string studentName;
        string course;
        string grade;
        uint256 year;
        string pdfHash;             // IPFS hash of PDF
        string photoHash;           // Student photo at time of issue
        address issuer;
        uint256 issuedAt;
        string transactionHash;
        bool isValid;
    }
    
    // ============ MAPPINGS ============
    
    // enrollmentNumber => Student
    mapping(string => Student) public students;
    
    // certificateHash => Certificate
    mapping(string => Certificate) public certificates;
    
    // enrollmentNumber => array of certificateHashes
    mapping(string => string[]) public studentCertificates;
    
    // Array of all certificate hashes (for admin view)
    string[] public allCertificateHashes;
    
    // Array of all enrollment numbers
    string[] public allEnrollmentNumbers;
    
    // ============ EVENTS ============
    
    event StudentRegistered(
        string enrollmentNumber,
        string name,
        address indexed registeredBy,
        uint256 timestamp
    );
    
    event CertificateIssued(
        string certificateHash,
        string enrollmentNumber,
        string studentName,
        string course,
        address indexed issuer,
        uint256 timestamp
    );
    
    event CertificateRevoked(
        string certificateHash,
        address indexed revokedBy,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(string memory _institutePassword) {
        admin = msg.sender;
        institutePassword = _institutePassword;
        totalCertificates = 0;
        totalStudents = 0;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Register a new student
     * @param _enrollmentNumber Unique enrollment number
     * @param _name Student's full name
     * @param _email Student's email
     * @param _phone Student's phone number
     * @param _photoHash IPFS hash or base64 of student photo
     */
    function registerStudent(
        string memory _enrollmentNumber,
        string memory _name,
        string memory _email,
        string memory _phone,
        string memory _photoHash
    ) public onlyAdmin {
        require(!students[_enrollmentNumber].isRegistered, "Student already registered");
        require(bytes(_enrollmentNumber).length > 0, "Enrollment number required");
        require(bytes(_name).length > 0, "Name required");
        
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
    
    /**
     * @dev Issue a new certificate
     * @param _certificateHash Unique hash for the certificate
     * @param _enrollmentNumber Student's enrollment number
     * @param _studentName Student's name on certificate
     * @param _course Course name
     * @param _grade Grade achieved
     * @param _year Year of completion
     * @param _pdfHash IPFS hash of the PDF
     * @param _photoHash Student photo hash
     */
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
            transactionHash: "",
            isValid: true
        });
        
        studentCertificates[_enrollmentNumber].push(_certificateHash);
        allCertificateHashes.push(_certificateHash);
        totalCertificates++;
        
        emit CertificateIssued(
            _certificateHash,
            _enrollmentNumber,
            _studentName,
            _course,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Revoke a certificate
     * @param _certificateHash Hash of certificate to revoke
     */
    function revokeCertificate(string memory _certificateHash) public onlyAdmin {
        require(certificates[_certificateHash].isValid, "Certificate not found or already revoked");
        certificates[_certificateHash].isValid = false;
        
        emit CertificateRevoked(_certificateHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update institute password
     * @param _newPassword New password for student login
     */
    function updateInstitutePassword(string memory _newPassword) public onlyAdmin {
        require(bytes(_newPassword).length > 0, "Password cannot be empty");
        institutePassword = _newPassword;
    }
    
    // ============ PUBLIC VIEW FUNCTIONS ============
    
    /**
     * @dev Verify if a certificate is valid
     * @param _certificateHash Certificate hash to verify
     * @return bool True if certificate is valid
     */
    function verifyCertificate(string memory _certificateHash) public view returns (bool) {
        return certificates[_certificateHash].isValid;
    }
    
    /**
     * @dev Get certificate details
     * @param _certificateHash Certificate hash
     * @return studentName, course, grade, year, enrollmentNumber, issuer, issuedAt, pdfHash, photoHash, isValid
     */
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
        return (
            cert.studentName,
            cert.course,
            cert.grade,
            cert.year,
            cert.enrollmentNumber,
            cert.issuer,
            cert.issuedAt,
            cert.pdfHash,
            cert.photoHash,
            cert.isValid
        );
    }
    
    /**
     * @dev Get student details
     * @param _enrollmentNumber Student's enrollment number
     * @return name, email, phone, photoHash, isRegistered, registeredAt
     */
    function getStudent(string memory _enrollmentNumber) public view returns (
        string memory name,
        string memory email,
        string memory phone,
        string memory photoHash,
        bool isRegistered,
        uint256 registeredAt
    ) {
        Student memory student = students[_enrollmentNumber];
        return (
            student.name,
            student.email,
            student.phone,
            student.photoHash,
            student.isRegistered,
            student.registeredAt
        );
    }
    
    /**
     * @dev Check if student exists
     * @param _enrollmentNumber Enrollment number to check
     * @return bool True if student is registered
     */
    function isStudentRegistered(string memory _enrollmentNumber) public view returns (bool) {
        return students[_enrollmentNumber].isRegistered;
    }
    
    /**
     * @dev Authenticate student for login
     * @param _enrollmentNumber Student's enrollment number
     * @param _password Institute password
     * @return bool True if authentication successful
     */
    function authenticateStudent(
        string memory _enrollmentNumber,
        string memory _password
    ) public view returns (bool) {
        if (!students[_enrollmentNumber].isRegistered) {
            return false;
        }
        return keccak256(bytes(_password)) == keccak256(bytes(institutePassword));
    }
    
    /**
     * @dev Get all certificates for a student
     * @param _enrollmentNumber Student's enrollment number
     * @return Array of certificate hashes
     */
    function getStudentCertificates(string memory _enrollmentNumber) public view returns (string[] memory) {
        return studentCertificates[_enrollmentNumber];
    }
    
    /**
     * @dev Get total certificate count
     * @return Total number of issued certificates
     */
    function getTotalCertificates() public view returns (uint256) {
        return totalCertificates;
    }
    
    /**
     * @dev Get total student count
     * @return Total number of registered students
     */
    function getTotalStudents() public view returns (uint256) {
        return totalStudents;
    }
    
    /**
     * @dev Get all certificate hashes (for admin)
     * @return Array of all certificate hashes
     */
    function getAllCertificateHashes() public view returns (string[] memory) {
        return allCertificateHashes;
    }
    
    /**
     * @dev Get all enrollment numbers (for admin)
     * @return Array of all enrollment numbers
     */
    function getAllEnrollmentNumbers() public view returns (string[] memory) {
        return allEnrollmentNumbers;
    }
    
    /**
     * @dev Get admin address
     * @return Admin wallet address
     */
    function getAdmin() public view returns (address) {
        return admin;
    }
    
    /**
     * @dev Transfer admin rights
     * @param _newAdmin New admin address
     */
    function transferAdmin(address _newAdmin) public onlyAdmin {
        require(_newAdmin != address(0), "Invalid address");
        admin = _newAdmin;
    }
}
