const XLSX = require('xlsx');
const fs = require('fs-extra');
const path = require('path');

class ExcelService {
  // Parse Excel file and extract data
  parseExcelFile(filePath) {
    try {
      console.log(`Parsing Excel file: ${filePath}`);

      // Read the workbook
      const workbook = XLSX.readFile(filePath);

      console.log(`Available sheets: ${workbook.SheetNames.join(', ')}`);

      // Find the sheet with "PROPOSAL NUMBER" header
      let targetSheetName = null;
      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
          defval: ''
        });

        // Check if this sheet has "PROPOSAL NUMBER" in any of the first 10 rows
        for (let i = 0; i < Math.min(10, rawData.length); i++) {
          const row = rawData[i];
          if (row && row.some(cell => 
            cell && typeof cell === 'string' && 
            cell.toUpperCase().includes('PROPOSAL')
          )) {
            targetSheetName = sheetName;
            console.log(`Found data in sheet: "${sheetName}"`);
            break;
          }
        }

        if (targetSheetName) break;
      }

      // If no sheet with "PROPOSAL NUMBER" found, use the second sheet if available, otherwise first
      if (!targetSheetName) {
        targetSheetName = workbook.SheetNames.length > 1 ? workbook.SheetNames[1] : workbook.SheetNames[0];
        console.log(`Using sheet: "${targetSheetName}" (no PROPOSAL column found, using default)`);
      }

      const worksheet = workbook.Sheets[targetSheetName];

      // Convert to JSON without assuming first row is header
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1, // Return array of arrays
        raw: false,
        defval: ''
      });

      console.log(`Total rows in sheet: ${rawData.length}`);

      // Find the header row (row that contains "PROPOSAL NUMBER")
      let headerRowIndex = -1;
      for (let i = 0; i < Math.min(10, rawData.length); i++) {
        const row = rawData[i];
        if (row && row.some(cell => 
          cell && typeof cell === 'string' && 
          cell.toUpperCase().includes('PROPOSAL')
        )) {
          headerRowIndex = i;
          console.log(`Found header row at row: ${i + 1}`);
          break;
        }
      }

      if (headerRowIndex === -1) {
        console.warn('Could not find header row with "PROPOSAL NUMBER". Using row 1 as header.');
        headerRowIndex = 0;
      }

      // Extract header row
      const headers = rawData[headerRowIndex];
      console.log(`Found ${headers.filter(h => h).length} columns`);

      // Extract data rows (everything after header row)
      const dataRows = rawData.slice(headerRowIndex + 1);

      // Convert to objects with headers as keys
      const data = dataRows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          if (header && header.trim()) {
            obj[header.trim()] = row[index] || '';
          }
        });
        return obj;
      }).filter(obj => Object.keys(obj).length > 0); // Remove empty rows

      console.log(`Extracted ${data.length} records from Excel file`);
      return data;
    } catch (error) {
      console.error(`Error parsing Excel file ${filePath}:`, error.message);
      throw error;
    }
  }

  // Normalize field names (handle different column naming conventions)
  normalizeRecord(record) {
    const normalized = {};

    // Map Excel column names to database field names
    const fieldMappings = {
      proposalNumber: ['PROPOSAL NUMBER', 'ProposalNumber', 'Proposal Number', 'proposal_number'],
      proposerCode: ['PROPOSER CODE', 'ProposerCode', 'Proposer Code'],
      proposerName: ['PROPOSER NAME', 'ProposerName', 'Proposer Name'],
      businessType: ['Business Type', 'BusinessType', 'BUSINESS TYPE'],
      sourceCode: ['SOURCECODE', 'SourceCode', 'Source Code'],
      createdDate: ['CREATED DATE', 'CreatedDate', 'Created Date'],
      inwardingUserCode: ['Inwarding User Code', 'InwardingUserCode', 'INWARDING USER CODE'],
      proposalIntimationDate: ['PROPOSAL INTIMATION DATE', 'ProposalIntimationDate', 'Proposal Intimation Date'],
      intimationAgeing: ['Intimation Ageing', 'IntimationAgeing', 'INTIMATION AGEING'],
      intimationSubAgeing: ['Intimation Sub Ageing', 'IntimationSubAgeing', 'INTIMATION SUB AGEING'],
      policyIssueDate: ['Policy Issue date', 'PolicyIssueDate', 'POLICY ISSUE DATE'],
      policyStatus: ['POLICY STATUS', 'PolicyStatus', 'Policy Status'],
      subStatus: ['SUBSTATUS', 'SubStatus', 'Sub Status'],
      discrepancyRemark: ['Discrepancy Remark', 'DiscrepancyRemark', 'DISCREPANCY REMARK'],
      latestSubStatusDate: ['Latest Sub Status Date', 'LatestSubStatusDate', 'LATEST SUB STATUS DATE'],
      subStatusAgeing: ['Sub Status Ageing', 'SubStatusAgeing', 'SUB STATUS AGEING'],
      subStatusSubAgeing: ['Sub Status Sub Ageing', 'SubStatusSubAgeing', 'SUB STATUS SUB AGEING'],
      branchCode: ['Branch Code', 'BranchCode', 'BRANCH CODE'],
      intermediaryCode: ['Intermediary CODE', 'IntermediaryCode', 'INTERMEDIARY CODE'],
      channel: ['Channel', 'CHANNEL'],
      goGreen: ['GO GREEN', 'GoGreen', 'Go Green'],
      combiFlag: ['combi Flag', 'CombiFlag', 'COMBI FLAG'],
      applicableSumInsured: ['APPLICABLE SUMINUSRED', 'ApplicableSumInsured', 'Applicable Sum Insured'],
      productName: ['PRODUCT NAME', 'ProductName', 'Product Name'],
      receiptTag: ['RECEIPT TAG', 'ReceiptTag', 'Receipt Tag'],
      latestFollowupDate: ['Latest Followup Date', 'LatestFollowupDate', 'LATEST FOLLOWUP DATE'],
      latestTeamName: ['Latest Team Name', 'LatestTeamName', 'LATEST TEAM NAME'],
      intermediaryName: ['Intermediary Name', 'IntermediaryName', 'INTERMEDIARY NAME'],
      intermediaryClassification: ['INTERMEDIARY CLASFICATION', 'IntermediaryClassification', 'Intermediary Classification'],
      inwardingBranchName: ['INWARDING BRANCH NAME', 'InwardingBranchName', 'Inwarding Branch Name'],
      employeeDiscount: ['EMPLOYEE DISCOUNT', 'EmployeeDiscount', 'Employee Discount'],
      coverType: ['Cover Type', 'CoverType', 'COVER TYPE'],
      lgCode: ['LG CODE', 'LgCode', 'LG Code'],
      leadId: ['LEAD ID', 'LeadId', 'Lead ID'],
      partnerSpCode: ['PARTNER SP CODE', 'PartnerSpCode', 'Partner SP Code'],
      salesManagerCode: ['Sales Manager Code', 'SalesManagerCode', 'SALES MANAGER CODE'],
      salesManagerName: ['Sales Manager Name', 'SalesManagerName', 'SALES MANAGER NAME'],
      policyExpiryDate: ['Policy Expiry Date', 'PolicyExpiryDate', 'POLICY EXPIRY DATE'],
      nationality: ['Nationality', 'NATIONALITY'],
      gstExemption: ['GST Exemption', 'GstExemption', 'GST EXEMPTION'],
      premiumMode: ['PREMIUM MODE', 'PremiumMode', 'Premium Mode'],
      netPremium: ['Net Premium', 'NetPremium', 'NET PREMIUM'],
      grossPremium: ['Gross Premium', 'GrossPremium', 'GROSS PREMIUM']
    };

    // Find and map each field
    for (const [standardField, variations] of Object.entries(fieldMappings)) {
      for (const variation of variations) {
        if (record[variation] !== undefined && record[variation] !== null) {
          normalized[standardField] = String(record[variation]).trim();
          break;
        }
      }
      
      // Set empty string if not found
      if (normalized[standardField] === undefined) {
        normalized[standardField] = '';
      }
    }

    // Ensure proposalNumber is present (primary key)
    if (!normalized.proposalNumber) {
      throw new Error('PROPOSAL NUMBER field is missing or empty');
    }

    return normalized;
  }

  // Parse and normalize all records from Excel
  extractCustomerData(filePath) {
    try {
      const rawData = this.parseExcelFile(filePath);
      const normalizedData = [];

      for (let i = 0; i < rawData.length; i++) {
        try {
          const normalized = this.normalizeRecord(rawData[i]);
          normalizedData.push(normalized);
        } catch (error) {
          console.warn(`Skipping row ${i + 2}: ${error.message}`);
        }
      }

      console.log(`Successfully normalized ${normalizedData.length} records`);
      return normalizedData;
    } catch (error) {
      console.error('Error extracting customer data:', error.message);
      throw error;
    }
  }

  // Delete file after processing
  async deleteFile(filePath) {
    try {
      await fs.remove(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error.message);
    }
  }

  // Export data to Excel
  exportToExcel(data, outputPath) {
    try {
      // Create a new workbook
      const workbook = XLSX.utils.book_new();

      // Convert data to worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Customers');

      // Write to file
      XLSX.writeFile(workbook, outputPath);

      console.log(`Exported ${data.length} records to ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('Error exporting to Excel:', error.message);
      throw error;
    }
  }

  // Generate sample Excel file for testing
  async generateSampleExcel(outputPath) {
    const sampleData = [
      {
        ProposalNo: 'P001',
        CustomerName: 'John Doe',
        Status: 'Active',
        Remarks: 'Initial proposal',
        Date: '2025-01-15'
      },
      {
        ProposalNo: 'P002',
        CustomerName: 'Jane Smith',
        Status: 'Pending',
        Remarks: 'Awaiting approval',
        Date: '2025-01-20'
      },
      {
        ProposalNo: 'P003',
        CustomerName: 'Bob Johnson',
        Status: 'Completed',
        Remarks: 'Project finished',
        Date: '2025-01-25'
      },
      {
        ProposalNo: 'P004',
        CustomerName: 'Alice Brown',
        Status: 'Active',
        Remarks: 'In progress',
        Date: '2025-02-01'
      },
      {
        ProposalNo: 'P005',
        CustomerName: 'Charlie Wilson',
        Status: 'Cancelled',
        Remarks: 'Client cancelled',
        Date: '2025-02-05'
      }
    ];

    return this.exportToExcel(sampleData, outputPath);
  }
}

module.exports = new ExcelService();
