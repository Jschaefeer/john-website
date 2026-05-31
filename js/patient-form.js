/* Patient Form — Armonk-Somers Podiatry
   Single-page layout rendered into #patientFormApp on patient-form.html */

class PatientForm {
    constructor() {
        this.formData = {};
        this.init();
    }

    init() {
        this.container = document.getElementById('patientFormApp');
        if (!this.container) return;
        this.loadjsPDF();
        this.render();
    }

    loadjsPDF() {
        if (typeof window.jsPDF === 'undefined' && typeof window.jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => console.log('jsPDF loaded');
            document.head.appendChild(script);
        }
    }

    render() {
        this.container.innerHTML = this.buildPageHTML();
        this.injectMedicalConditions();
        this.bindEvents();
    }

    /* ─── PAGE HTML ─────────────────────────────────────────────────────────── */

    buildPageHTML() {
        return `
<div class="container patient-form-shell">

  <div class="form-page-intro">
    <h1>New Patient Information Form</h1>
  </div>

  <form id="patientForm" novalidate>

    <!-- ── 1. PERSONAL INFORMATION ──────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Personal Information</h2>
      <p class="form-section-desc">Your basic contact and identification details.</p>

      <div class="form-grid form-grid--3">
        <div class="field">
          <label class="field-label" for="lastName">Last Name <span aria-hidden="true">*</span></label>
          <input type="text" id="lastName" name="lastName" required autocomplete="family-name">
          <span class="field-error">Please enter your last name</span>
        </div>
        <div class="field">
          <label class="field-label" for="firstName">First Name <span aria-hidden="true">*</span></label>
          <input type="text" id="firstName" name="firstName" required autocomplete="given-name">
          <span class="field-error">Please enter your first name</span>
        </div>
        <div class="field">
          <label class="field-label" for="middleInitial">Middle Initial</label>
          <input type="text" id="middleInitial" name="middleInitial" maxlength="1" autocomplete="additional-name">
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="streetAddress">Street Address <span aria-hidden="true">*</span></label>
          <input type="text" id="streetAddress" name="streetAddress" required autocomplete="street-address">
          <span class="field-error">Please enter your street address</span>
        </div>
      </div>

      <div class="form-grid form-grid--3">
        <div class="field">
          <label class="field-label" for="city">City <span aria-hidden="true">*</span></label>
          <input type="text" id="city" name="city" required autocomplete="address-level2">
          <span class="field-error">Please enter your city</span>
        </div>
        <div class="field">
          <label class="field-label" for="state">State <span aria-hidden="true">*</span></label>
          <select id="state" name="state" required autocomplete="address-level1">
            <option value="">Select State</option>
            <option value="NY">New York</option>
            <option value="CT">Connecticut</option>
            <option value="NJ">New Jersey</option>
            <option value="PA">Pennsylvania</option>
            <option value="MA">Massachusetts</option>
            <option value="VT">Vermont</option>
            <option value="NH">New Hampshire</option>
            <option value="ME">Maine</option>
            <option value="RI">Rhode Island</option>
          </select>
          <span class="field-error">Please select your state</span>
        </div>
        <div class="field">
          <label class="field-label" for="zip">ZIP Code <span aria-hidden="true">*</span></label>
          <input type="text" id="zip" name="zip" pattern="[0-9]{5}" maxlength="5" required autocomplete="postal-code">
          <span class="field-error">Please enter a valid 5-digit ZIP</span>
        </div>
      </div>

      <div class="form-grid form-grid--3">
        <div class="field">
          <label class="field-label" for="homePhone">Home Phone</label>
          <input type="tel" id="homePhone" name="homePhone" placeholder="(555) 123-4567" autocomplete="home tel">
        </div>
        <div class="field">
          <label class="field-label" for="workPhone">Work Phone</label>
          <input type="tel" id="workPhone" name="workPhone" placeholder="(555) 123-4567" autocomplete="work tel">
        </div>
        <div class="field">
          <label class="field-label" for="cellPhone">Cell Phone <span aria-hidden="true">*</span></label>
          <input type="tel" id="cellPhone" name="cellPhone" placeholder="(555) 123-4567" required autocomplete="mobile tel">
          <span class="field-error">Please enter your cell phone number</span>
        </div>
      </div>

      <div class="form-grid form-grid--3">
        <div class="field">
          <label class="field-label" for="dateOfBirth">Date of Birth <span aria-hidden="true">*</span></label>
          <input type="date" id="dateOfBirth" name="dateOfBirth" required autocomplete="bday">
          <span class="field-error">Please enter your date of birth</span>
        </div>
        <div class="field">
          <label class="field-label" for="ssn">Social Security Number <span aria-hidden="true">*</span></label>
          <input type="text" id="ssn" name="ssn" placeholder="123-45-6789" pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}" required inputmode="numeric">
          <span class="field-error">Please enter your SSN (123-45-6789)</span>
        </div>
        <div class="field">
          <label class="field-label" for="sex">Sex <span aria-hidden="true">*</span></label>
          <select id="sex" name="sex" required>
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <span class="field-error">Please select your sex</span>
        </div>
      </div>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="email">Email Address <span aria-hidden="true">*</span></label>
          <input type="email" id="email" name="email" required autocomplete="email">
          <span class="field-error">Please enter a valid email address</span>
        </div>
        <div class="field">
          <label class="field-label" for="occupation">Occupation</label>
          <input type="text" id="occupation" name="occupation" autocomplete="organization-title">
        </div>
      </div>
    </section>

    <!-- ── 2. PERSONAL STATUS ────────────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Personal Status</h2>
      <p class="form-section-desc">Please indicate your current marital, employment, and student status.</p>

      <div class="field-group">
        <span class="field-label">Marital Status</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="maritalStatus" id="single" value="SINGLE">
            <span>Single</span>
          </label>
          <label class="choice">
            <input type="radio" name="maritalStatus" id="married" value="MARRIED">
            <span>Married</span>
          </label>
          <label class="choice">
            <input type="radio" name="maritalStatus" id="divorced" value="DIVORCED">
            <span>Divorced</span>
          </label>
          <label class="choice">
            <input type="radio" name="maritalStatus" id="widow" value="WIDOW">
            <span>Widow / Widower</span>
          </label>
          <label class="choice">
            <input type="radio" name="maritalStatus" id="otherMarital" value="OTHER">
            <span>Other</span>
          </label>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Employment Status</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="employmentStatus" id="fullTime" value="FULL TIME">
            <span>Full Time</span>
          </label>
          <label class="choice">
            <input type="radio" name="employmentStatus" id="partTime" value="PART-TIME">
            <span>Part Time</span>
          </label>
          <label class="choice">
            <input type="radio" name="employmentStatus" id="selfEmployed" value="SELF EMPLOYED">
            <span>Self Employed</span>
          </label>
          <label class="choice">
            <input type="radio" name="employmentStatus" id="retired" value="RETIRED">
            <span>Retired</span>
          </label>
          <label class="choice">
            <input type="radio" name="employmentStatus" id="unemployed" value="NO">
            <span>Not Employed</span>
          </label>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Student Status</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="studentStatus" id="fullTimeStudent" value="FULL TIME">
            <span>Full Time Student</span>
          </label>
          <label class="choice">
            <input type="radio" name="studentStatus" id="partTimeStudent" value="PART TIME">
            <span>Part Time Student</span>
          </label>
          <label class="choice">
            <input type="radio" name="studentStatus" id="notStudent" value="NO">
            <span>Not a Student</span>
          </label>
        </div>
      </div>
    </section>

    <!-- ── 3. PRIMARY INSURANCE ──────────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Primary Insurance Information</h2>
      <p class="form-section-desc">Please provide your primary insurance details.</p>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="primaryInsuranceCompany">Insurance Company <span aria-hidden="true">*</span></label>
          <input type="text" id="primaryInsuranceCompany" name="primaryInsuranceCompany" required>
          <span class="field-error">Please enter your insurance company</span>
        </div>
        <div class="field">
          <label class="field-label" for="primaryInsuranceId">Policy / ID Number <span aria-hidden="true">*</span></label>
          <input type="text" id="primaryInsuranceId" name="primaryInsuranceId" required>
          <span class="field-error">Please enter your insurance ID</span>
        </div>
      </div>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="primaryGroupNumber">Group Number</label>
          <input type="text" id="primaryGroupNumber" name="primaryGroupNumber">
        </div>
        <div class="field">
          <label class="field-label" for="primaryGroupName">Group Name</label>
          <input type="text" id="primaryGroupName" name="primaryGroupName">
        </div>
      </div>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="primaryInsuredName">Insured Person's Name</label>
          <input type="text" id="primaryInsuredName" name="primaryInsuredName" placeholder="If different from patient">
        </div>
        <div class="field">
          <label class="field-label" for="primaryInsuredDOB">Insured Person's Date of Birth</label>
          <input type="date" id="primaryInsuredDOB" name="primaryInsuredDOB">
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Relationship to Insured Person</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="primaryRelationship" id="primarySelf" value="SELF" checked>
            <span>Self</span>
          </label>
          <label class="choice">
            <input type="radio" name="primaryRelationship" id="primarySpouse" value="SPOUSE">
            <span>Spouse</span>
          </label>
          <label class="choice">
            <input type="radio" name="primaryRelationship" id="primaryChild" value="CHILD">
            <span>Child</span>
          </label>
          <label class="choice">
            <input type="radio" name="primaryRelationship" id="primaryOther" value="OTHER">
            <span>Other</span>
          </label>
        </div>
      </div>
    </section>

    <!-- ── 4. SECONDARY INSURANCE ────────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Secondary Insurance</h2>
      <p class="form-section-desc">If you have secondary insurance, please provide details (optional).</p>

      <div class="field-group">
        <span class="field-label">Do you have secondary insurance?</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="hasSecondaryInsurance" id="secondaryInsuranceNo" value="NO">
            <span>No</span>
          </label>
          <label class="choice">
            <input type="radio" name="hasSecondaryInsurance" id="secondaryInsuranceYes" value="YES">
            <span>Yes</span>
          </label>
        </div>
      </div>

      <div class="conditional-block" id="secondaryInsuranceDetails">
        <div class="form-grid form-grid--2">
          <div class="field">
            <label class="field-label" for="secondaryInsuranceCompany">Insurance Company</label>
            <input type="text" id="secondaryInsuranceCompany" name="secondaryInsuranceCompany">
          </div>
          <div class="field">
            <label class="field-label" for="secondaryInsuranceId">Policy / ID Number</label>
            <input type="text" id="secondaryInsuranceId" name="secondaryInsuranceId">
          </div>
        </div>

        <div class="form-grid form-grid--2">
          <div class="field">
            <label class="field-label" for="secondaryGroupNumber">Group Number</label>
            <input type="text" id="secondaryGroupNumber" name="secondaryGroupNumber">
          </div>
          <div class="field">
            <label class="field-label" for="secondaryGroupName">Group Name</label>
            <input type="text" id="secondaryGroupName" name="secondaryGroupName">
          </div>
        </div>

        <div class="form-grid form-grid--2">
          <div class="field">
            <label class="field-label" for="secondaryInsuredName">Insured Person's Name</label>
            <input type="text" id="secondaryInsuredName" name="secondaryInsuredName" placeholder="If different from patient">
          </div>
          <div class="field">
            <label class="field-label" for="secondaryInsuredDOB">Insured Person's Date of Birth</label>
            <input type="date" id="secondaryInsuredDOB" name="secondaryInsuredDOB">
          </div>
        </div>

        <div class="field-group">
          <span class="field-label">Relationship to Insured Person</span>
          <div class="choice-list choice-row">
            <label class="choice">
              <input type="radio" name="secondaryRelationship" id="secondarySelf" value="SELF">
              <span>Self</span>
            </label>
            <label class="choice">
              <input type="radio" name="secondaryRelationship" id="secondarySpouse" value="SPOUSE">
              <span>Spouse</span>
            </label>
            <label class="choice">
              <input type="radio" name="secondaryRelationship" id="secondaryChild" value="CHILD">
              <span>Child</span>
            </label>
            <label class="choice">
              <input type="radio" name="secondaryRelationship" id="secondaryOther" value="OTHER">
              <span>Other</span>
            </label>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 5. MEDICAL HISTORY & REFERRAL ─────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Medical History &amp; Referral</h2>
      <p class="form-section-desc">Tell us about your medical background and how you found us.</p>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="referredBy">Who referred you to our practice?</label>
          <input type="text" id="referredBy" name="referredBy">
        </div>
      </div>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="primaryCarePhysician">Primary Care Physician Name</label>
          <input type="text" id="primaryCarePhysician" name="primaryCarePhysician">
        </div>
        <div class="field">
          <label class="field-label" for="primaryCarePhone">Primary Care Phone</label>
          <input type="tel" id="primaryCarePhone" name="primaryCarePhone" placeholder="(555) 123-4567">
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="primaryCareAddress">Primary Care Address</label>
          <input type="text" id="primaryCareAddress" name="primaryCareAddress">
        </div>
      </div>

      <div class="form-grid form-grid--2">
        <div class="field">
          <label class="field-label" for="lastVisitDate">Date of Last Visit</label>
          <input type="date" id="lastVisitDate" name="lastVisitDate">
        </div>
        <div class="field">
          <label class="field-label" for="lastVisitReason">Reason for Last Visit</label>
          <input type="text" id="lastVisitReason" name="lastVisitReason">
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="preferredPharmacy">Preferred Pharmacy</label>
          <input type="text" id="preferredPharmacy" name="preferredPharmacy">
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Is there any personal or family history of diabetes?</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="diabetesHistory" id="diabetesNo" value="NO">
            <span>No</span>
          </label>
          <label class="choice">
            <input type="radio" name="diabetesHistory" id="diabetesYes" value="YES">
            <span>Yes</span>
          </label>
        </div>
      </div>

      <div class="conditional-block" id="diabetesDetails">
        <div class="form-grid">
          <div class="field">
            <label class="field-label" for="diabetesWho">If yes — who has diabetes? (yourself, family member, etc.)</label>
            <input type="text" id="diabetesWho" name="diabetesWho" placeholder="Please specify who has diabetes">
          </div>
        </div>
      </div>
    </section>

    <!-- ── 6. CURRENT COMPLAINT ──────────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Current Complaint</h2>
      <p class="form-section-desc">Tell us about the problem that brought you here today.</p>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="chiefComplaint">
            Chief complaint — please include foot, ankle, knee, thigh and/or hip. Left, right, or both? <span aria-hidden="true">*</span>
          </label>
          <textarea id="chiefComplaint" name="chiefComplaint" required rows="4" placeholder="Describe your symptoms, when they started, and which side is affected…"></textarea>
          <span class="field-error">Please describe your chief complaint</span>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="problemStart">When did your problem start?</label>
          <input type="text" id="problemStart" name="problemStart" placeholder="e.g. 2 weeks ago, last month, gradually over time">
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Have you ever seen a podiatrist before?</span>
        <div class="choice-list choice-row">
          <label class="choice">
            <input type="radio" name="seenPodiatrist" id="podiatristNo" value="NO">
            <span>No</span>
          </label>
          <label class="choice">
            <input type="radio" name="seenPodiatrist" id="podiatristYes" value="YES">
            <span>Yes</span>
          </label>
        </div>
      </div>

      <div class="conditional-block" id="previousPodiatristDetails">
        <div class="form-grid form-grid--2">
          <div class="field">
            <label class="field-label" for="previousPodiatrist">Doctor's Name</label>
            <input type="text" id="previousPodiatrist" name="previousPodiatrist" placeholder="Previous podiatrist's name">
          </div>
          <div class="field">
            <label class="field-label" for="previousProblems">For what problems?</label>
            <input type="text" id="previousProblems" name="previousProblems" placeholder="Previous foot / ankle problems treated">
          </div>
        </div>
      </div>
    </section>

    <!-- ── 7. ALLERGIES & MEDICAL HISTORY ────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Allergies &amp; Medical History</h2>
      <p class="form-section-desc">Check all that apply. This helps us keep you safe during your visit.</p>

      <div class="field-group">
        <span class="field-label">Allergies — are you allergic or sensitive to any of the following?</span>
        <div class="check-grid">
          <label class="choice">
            <input type="checkbox" id="allergyTape" name="allergies" value="Adhesive Tape">
            <span>Adhesive Tape</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyAnticoagulant" name="allergies" value="Anticoagulant Therapy">
            <span>Anticoagulant Therapy</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyAspirin" name="allergies" value="Aspirin">
            <span>Aspirin</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyBarbituate" name="allergies" value="Barbituate">
            <span>Barbituate</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyCodeine" name="allergies" value="Codeine">
            <span>Codeine</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyEpinephrine" name="allergies" value="Epinephrine">
            <span>Epinephrine</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyInsectStings" name="allergies" value="Insect Stings">
            <span>Insect Stings</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyIodine" name="allergies" value="Iodine">
            <span>Iodine</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyLatex" name="allergies" value="Latex">
            <span>Latex</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyLocalAnesthetic" name="allergies" value="Local Anesthetic">
            <span>Local Anesthetic</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergyPenicillin" name="allergies" value="Penicillin">
            <span>Penicillin</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="allergySulfa" name="allergies" value="Sulfa">
            <span>Sulfa</span>
          </label>
        </div>

        <div class="field" style="margin-top:1rem;">
          <label class="field-label" for="otherAllergies">Other allergies (please list)</label>
          <input type="text" id="otherAllergies" name="otherAllergies" placeholder="List any other allergies">
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Medical Conditions — check all you currently have or have had in the past:</span>
        <div class="check-grid check-grid--conditions" id="medicalConditionsGrid">
          <!-- injected by injectMedicalConditions() -->
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Foot Problems — check any that apply:</span>
        <div class="check-grid">
          <label class="choice">
            <input type="checkbox" id="anklePain" name="footProblems" value="Ankle Pain">
            <span>Ankle Pain</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="athletesFoot" name="footProblems" value="Athlete's foot">
            <span>Athlete's Foot</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="bunions" name="footProblems" value="Bunions">
            <span>Bunions</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="callusesCorns" name="footProblems" value="Calluses and/or Corns">
            <span>Calluses and/or Corns</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="crampsNumbness" name="footProblems" value="Cramps or numbness in feet or legs">
            <span>Cramps or Numbness in Feet or Legs</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="flatFeet" name="footProblems" value="Flat feet">
            <span>Flat Feet</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="hammertoes" name="footProblems" value="Hammertoes">
            <span>Hammertoes</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="heelArchPain" name="footProblems" value="Heel pain/Arch Pain">
            <span>Heel Pain / Arch Pain</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="ingrownToenails" name="footProblems" value="Ingrown toenails">
            <span>Ingrown Toenails</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="plantarWarts" name="footProblems" value="Plantar Warts">
            <span>Plantar Warts</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="swollenAnklesFeet" name="footProblems" value="Swollen ankles/feet">
            <span>Swollen Ankles / Feet</span>
          </label>
          <label class="choice">
            <input type="checkbox" id="tiredFeetLegs" name="footProblems" value="Tired feet or legs">
            <span>Tired Feet or Legs</span>
          </label>
        </div>
      </div>
    </section>

    <!-- ── 8. ADDITIONAL INFORMATION ─────────────────────────────────────── -->
    <section class="form-section">
      <h2 class="form-section-title">Additional Information</h2>
      <p class="form-section-desc">Please share any other medical details that may be relevant.</p>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="otherConditions">Other conditions:</label>
          <textarea id="otherConditions" name="otherConditions" rows="3" placeholder="List any other medical conditions not mentioned above"></textarea>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="surgeries">Surgeries you have had:</label>
          <textarea id="surgeries" name="surgeries" rows="3" placeholder="List any surgeries and approximate dates"></textarea>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="hospitalizations">Hospitalizations (other than surgeries listed):</label>
          <textarea id="hospitalizations" name="hospitalizations" rows="3" placeholder="List any hospitalizations and approximate dates"></textarea>
        </div>
      </div>

      <div class="form-grid">
        <div class="field">
          <label class="field-label" for="medications">
            All current medications — include prescription, vitamins, supplements, and over-the-counter:
          </label>
          <textarea id="medications" name="medications" rows="4" placeholder="List medications, dosages, and frequency if known"></textarea>
        </div>
      </div>

      <div class="acknowledgment">
        <label class="choice">
          <input type="checkbox" id="acknowledgePolicyTerms" name="acknowledgePolicyTerms" required>
          <span>
            I acknowledge that I have read and understand the
            <a href="insurance.html" target="_blank" rel="noopener">practice payment policy and HIPAA privacy notice</a>.
            I authorize the release of medical information for treatment, payment, and healthcare operations,
            and authorize payments to go directly to Dr. John O'Hanlon, D.P.M. <strong>*</strong>
          </span>
        </label>
        <span class="field-error" id="ackError">You must acknowledge the policy to continue</span>
      </div>
    </section>

  </form><!-- /#patientForm -->

  <div class="form-actions">
    <div class="container form-actions-inner">
      <a href="contact.html" class="btn-cancel-form">Cancel</a>
      <button type="submit" form="patientForm" class="btn-submit-form">
        <i class="fas fa-file-pdf" aria-hidden="true"></i>
        Submit &amp; Generate My Form
      </button>
    </div>
  </div>

</div><!-- /.patient-form-shell -->
        `;
    }

    /* ─── MEDICAL CONDITIONS ────────────────────────────────────────────────── */

    generateMedicalConditions() {
        const conditions = [
            'AIDS/HIV', 'Anemia', 'Anxiety, Depression', 'Arthritis',
            'Artificial Joints, Implants', 'Asthma', 'Back Problems', 'Bleeding Disorders',
            'Cancer', 'Chemical Dependency', 'Chest Pain / Angina', 'Circulatory Problems',
            'Convulsions', 'Diabetes', 'Dizziness / Fainting', 'Epilepsy',
            'Foot / Leg Cramping', 'Foot/Ankle/Leg Swelling', 'Foot Pain', 'Hayfever',
            'Headaches/Migraines', 'Heart Disease', 'Hemophilia', 'Hepatitis / Jaundice',
            'High Blood Pressure', 'Kidney Problems', 'Liver Disease', 'Low Blood Pressure',
            'Neuropathy', 'Nervousness', 'Phlebitis', 'Pregnancy',
            'Psychiatric Care', 'Radiation Therapy', 'Rash', 'Rheumatic Disease',
            'Shin Splints', 'Shortness of breath', 'Sinus Problems', 'Special Diet',
            'Stroke', 'Swollen Glands', 'Thyroid Disease', 'Tuberculosis',
            'Ulcers', 'Varicose Veins', 'Weight Loss/Gain'
        ];

        return conditions.map(condition => {
            const id = condition.toLowerCase().replace(/[^a-z0-9]/g, '');
            return `<label class="choice">
              <input type="checkbox" id="${id}" name="medicalConditions" value="${condition}">
              <span>${condition}</span>
            </label>`;
        }).join('\n');
    }

    injectMedicalConditions() {
        const grid = document.getElementById('medicalConditionsGrid');
        if (grid) {
            grid.innerHTML = this.generateMedicalConditions();
        }
    }

    /* ─── EVENT BINDING ─────────────────────────────────────────────────────── */

    bindEvents() {
        const form = document.getElementById('patientForm');
        if (!form) return;

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        // Also wire the external submit button explicitly (form= attr handles most cases)
        const submitBtn = this.container.querySelector('.btn-submit-form');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                // The button has form="patientForm" so the submit event fires on the form.
                // This listener is a no-op safety net in case the attribute isn't honoured.
            });
        }

        // Conditional logic
        form.addEventListener('change', (e) => {
            this.handleConditionalFields(e.target);
            if (e.target.hasAttribute('required')) {
                this.validateField(e.target);
            }
        });

        // Inline validation on blur
        form.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        }, true);

        // Phone formatting
        form.addEventListener('input', (e) => {
            if (e.target.type === 'tel') {
                this.formatPhoneNumber(e.target);
            }
            if (e.target.name === 'ssn') {
                this.formatSSN(e.target);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                window.location.href = 'contact.html';
            }
        });
    }

    /* ─── CONDITIONAL LOGIC ─────────────────────────────────────────────────── */

    handleConditionalFields(element) {
        const map = {
            hasSecondaryInsurance: { YES: 'secondaryInsuranceDetails' },
            diabetesHistory:       { YES: 'diabetesDetails' },
            seenPodiatrist:        { YES: 'previousPodiatristDetails' }
        };

        const rule = map[element.name];
        if (!rule) return;

        Object.keys(rule).forEach(triggerValue => {
            const blockId = rule[triggerValue];
            const block = document.getElementById(blockId);
            if (!block) return;

            const shouldShow = element.value === triggerValue && element.checked !== false;
            block.classList.toggle('is-visible', shouldShow);

            if (!shouldShow) {
                block.querySelectorAll('input, select, textarea').forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                });
            }
        });
    }

    /* ─── FORMATTING ────────────────────────────────────────────────────────── */

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        input.value = value;
    }

    formatSSN(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length >= 5) {
            value = `${value.slice(0, 3)}-${value.slice(3, 5)}-${value.slice(5, 9)}`;
        } else if (value.length >= 3) {
            value = `${value.slice(0, 3)}-${value.slice(3)}`;
        }
        input.value = value;
    }

    /* ─── VALIDATION ────────────────────────────────────────────────────────── */

    validateField(field) {
        const wrapper = field.closest('.field') || field.closest('.acknowledgment');
        let valid = true;

        if (wrapper) wrapper.classList.remove('is-invalid');

        if (field.hasAttribute('required')) {
            if (field.type === 'checkbox') {
                valid = field.checked;
            } else {
                valid = field.value.trim() !== '';
            }
        }

        if (valid && field.type === 'email' && field.value) {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        }

        if (valid && field.name === 'zip' && field.value) {
            valid = /^\d{5}$/.test(field.value);
        }

        if (valid && field.name === 'ssn' && field.value) {
            valid = /^\d{3}-\d{2}-\d{4}$/.test(field.value);
        }

        if (valid && field.type === 'tel' && field.hasAttribute('required') && field.value) {
            valid = /^\(\d{3}\) \d{3}-\d{4}$/.test(field.value);
        }

        if (!valid && wrapper) {
            wrapper.classList.add('is-invalid');
        }

        return valid;
    }

    validateForm() {
        const form = document.getElementById('patientForm');
        const required = Array.from(form.querySelectorAll('[required]'));
        let firstInvalid = null;
        let allValid = true;

        required.forEach(field => {
            if (!this.validateField(field)) {
                allValid = false;
                if (!firstInvalid) firstInvalid = field;
            }
        });

        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => firstInvalid.focus(), 400);
        }

        return allValid;
    }

    /* ─── DATA COLLECTION ───────────────────────────────────────────────────── */

    collectFormData() {
        const form = document.getElementById('patientForm');
        const data = {};

        form.querySelectorAll('input, select, textarea').forEach(field => {
            if (!field.name) return;

            if (field.type === 'checkbox') {
                if (!Array.isArray(data[field.name])) data[field.name] = [];
                if (field.checked) data[field.name].push(field.value);
            } else if (field.type === 'radio') {
                if (field.checked) data[field.name] = field.value;
            } else {
                data[field.name] = field.value;
            }
        });

        this.formData = data;
    }

    /* ─── SUBMIT HANDLER ────────────────────────────────────────────────────── */

    handleSubmit() {
        if (!this.validateForm()) return;

        this.collectFormData();

        const btn = this.container.querySelector('.btn-submit-form');
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Preparing your form…';
        }

        setTimeout(() => {
            this.generatePDF();
            this.showSuccess();
        }, 1800);
    }

    /* ─── PDF GENERATION ────────────────────────────────────────────────────── */

    generatePDF() {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const headerBlue  = [26, 73, 126];
            const textBlack   = [0, 0, 0];
            const grayText    = [88, 88, 88];
            const lightGray   = [200, 200, 200];

            let yPos = 20;
            const leftMargin    = 20;
            const rightMargin   = 190;
            const lineHeight    = 5;
            const sectionSpacing = 12;

            const checkPageBreak = (neededSpace = 20) => {
                if (yPos + neededSpace > 270) {
                    doc.addPage();
                    this.addProfessionalHeader(doc, headerBlue);
                    yPos = 50;
                    return true;
                }
                return false;
            };

            // Header
            this.addProfessionalHeader(doc, headerBlue);
            yPos = 50;

            // Form title
            doc.setTextColor(...headerBlue);
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.text('NEW PATIENT INFORMATION FORM', leftMargin, yPos);

            doc.setTextColor(...grayText);
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Date: ${new Date().toLocaleDateString()}`, rightMargin - 40, yPos);
            yPos += sectionSpacing;

            // PATIENT INFORMATION
            yPos += this.addSection(doc, 'PATIENT INFORMATION', yPos, headerBlue, textBlack);

            const col1X = leftMargin;
            const col2X = 110;
            const fieldHeight = 8;

            this.addField(doc, 'Last Name:', this.formData.lastName || '', col1X, yPos);
            this.addField(doc, 'First Name:', this.formData.firstName || '', col2X, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'Date of Birth:', this.formatDate(this.formData.dateOfBirth), col1X, yPos);
            this.addField(doc, 'Sex:', this.formData.sex || '', col2X, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'SSN:', this.formData.ssn || '', col1X, yPos);
            this.addField(doc, 'Cell Phone:', this.formData.cellPhone || '', col2X, yPos);
            yPos += fieldHeight;

            this.addFieldWide(doc, 'Address:', this.formData.streetAddress || '', leftMargin, yPos);
            yPos += fieldHeight;

            const cityStateZip = `${this.formData.city || ''}, ${this.formData.state || ''} ${this.formData.zip || ''}`.trim().replace(/^,\s*/, '');
            this.addField(doc, 'City, State, ZIP:', cityStateZip, col1X, yPos);
            this.addField(doc, 'Email:', this.formData.email || '', col2X, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'Occupation:', this.formData.occupation || '', col1X, yPos);
            this.addField(doc, 'Marital Status:', this.formData.maritalStatus || '', col2X, yPos);
            yPos += sectionSpacing;

            // INSURANCE INFORMATION
            checkPageBreak(60);
            yPos += this.addSection(doc, 'INSURANCE INFORMATION', yPos, headerBlue, textBlack);

            this.addFieldWide(doc, 'Primary Insurance:', this.formData.primaryInsuranceCompany || '', leftMargin, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'Policy/ID Number:', this.formData.primaryInsuranceId || '', col1X, yPos);
            this.addField(doc, 'Group Number:', this.formData.primaryGroupNumber || '', col2X, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'Group Name:', this.formData.primaryGroupName || '', col1X, yPos);
            this.addField(doc, 'Relationship:', this.formData.primaryRelationship || 'SELF', col2X, yPos);
            yPos += fieldHeight;

            if (this.formData.hasSecondaryInsurance === 'YES' && this.formData.secondaryInsuranceCompany) {
                this.addFieldWide(doc, 'Secondary Insurance:', this.formData.secondaryInsuranceCompany || '', leftMargin, yPos);
                yPos += fieldHeight;

                this.addField(doc, 'Secondary ID:', this.formData.secondaryInsuranceId || '', col1X, yPos);
                this.addField(doc, 'Secondary Group:', this.formData.secondaryGroupNumber || '', col2X, yPos);
                yPos += fieldHeight;
            }
            yPos += sectionSpacing;

            // MEDICAL HISTORY
            checkPageBreak(50);
            yPos += this.addSection(doc, 'MEDICAL HISTORY', yPos, headerBlue, textBlack);

            this.addField(doc, 'Referred By:', this.formData.referredBy || '', col1X, yPos);
            this.addField(doc, 'Primary Care Physician:', this.formData.primaryCarePhysician || '', col2X, yPos);
            yPos += fieldHeight;

            this.addField(doc, 'Preferred Pharmacy:', this.formData.preferredPharmacy || '', col1X, yPos);
            this.addField(doc, 'Seen Podiatrist Before:', this.formData.seenPodiatrist || 'NO', col2X, yPos);
            yPos += fieldHeight;

            if (this.formData.seenPodiatrist === 'YES' && this.formData.previousPodiatrist) {
                this.addField(doc, 'Previous Podiatrist:', this.formData.previousPodiatrist || '', col1X, yPos);
                this.addField(doc, 'For Problems:', this.formData.previousProblems || '', col2X, yPos);
                yPos += fieldHeight;
            }

            const diabetesDisplay = this.formData.diabetesHistory === 'YES'
                ? `YES — ${this.formData.diabetesWho || ''}`.trim()
                : (this.formData.diabetesHistory || 'NO');
            this.addField(doc, 'Diabetes History:', diabetesDisplay, col1X, yPos);
            yPos += sectionSpacing;

            // CHIEF COMPLAINT
            checkPageBreak(40);
            yPos += this.addSection(doc, 'CHIEF COMPLAINT', yPos, headerBlue, textBlack);

            if (this.formData.chiefComplaint) {
                yPos += this.addTextArea(doc, 'Primary Concern:', this.formData.chiefComplaint, leftMargin, yPos);
            }

            this.addField(doc, 'When problem started:', this.formData.problemStart || '', col1X, yPos);
            yPos += sectionSpacing;

            // ALLERGIES & CONDITIONS
            checkPageBreak(60);
            yPos += this.addSection(doc, 'ALLERGIES & MEDICAL CONDITIONS', yPos, headerBlue, textBlack);

            if (this.formData.allergies && this.formData.allergies.length > 0) {
                yPos += this.addTextArea(doc, 'Allergies:', this.formData.allergies.join(', '), leftMargin, yPos);
            }
            if (this.formData.otherAllergies) {
                yPos += this.addTextArea(doc, 'Other Allergies:', this.formData.otherAllergies, leftMargin, yPos);
            }
            if (this.formData.medicalConditions && this.formData.medicalConditions.length > 0) {
                checkPageBreak(20);
                yPos += this.addTextArea(doc, 'Medical Conditions:', this.formData.medicalConditions.join(', '), leftMargin, yPos);
            }
            if (this.formData.footProblems && this.formData.footProblems.length > 0) {
                checkPageBreak(20);
                yPos += this.addTextArea(doc, 'Foot Problems:', this.formData.footProblems.join(', '), leftMargin, yPos);
            }

            if (this.formData.medications) {
                checkPageBreak(30);
                yPos += this.addTextArea(doc, 'Current Medications:', this.formData.medications, leftMargin, yPos);
            }
            if (this.formData.surgeries) {
                checkPageBreak(30);
                yPos += this.addTextArea(doc, 'Previous Surgeries:', this.formData.surgeries, leftMargin, yPos);
            }
            if (this.formData.hospitalizations) {
                checkPageBreak(30);
                yPos += this.addTextArea(doc, 'Hospitalizations:', this.formData.hospitalizations, leftMargin, yPos);
            }
            if (this.formData.otherConditions) {
                checkPageBreak(30);
                yPos += this.addTextArea(doc, 'Other Conditions:', this.formData.otherConditions, leftMargin, yPos);
            }

            // PAYMENT POLICY — new page
            doc.addPage();
            this.addProfessionalHeader(doc, headerBlue);
            yPos = 50;

            yPos += this.addSection(doc, 'PRACTICE PAYMENT POLICY & ACKNOWLEDGMENT', yPos, headerBlue, textBlack);

            const policyText = [
                'MANAGED CARE/HMO: We participate with most HMOs. Patient must provide insurance information and referrals. Copayments collected at each visit.',
                '',
                'MEDICARE: We participate with Medicare for physician visits and x-rays. Patients responsible for 20% coinsurance and annual deductible.',
                '',
                "WORKERS' COMPENSATION/NO FAULT: Patient must bring all insurance and attorney information at initial visit.",
                '',
                'PRIVATE INSURANCE: Payment required day of service if not covered under participating plans. Itemized receipts provided upon request.',
                '',
                'PAYMENT POLICY: Copayments and non-covered services due at time of service. Payment by cash, check, or credit card (Visa, MasterCard, Discover). $25 fee for returned checks.',
                '',
                "AUTHORIZATION: I authorize release of medical information for treatment, payment, and healthcare operations. I authorize payments to go directly to Dr. John O'Hanlon, D.P.M. I understand I am responsible for copayments, coinsurance, deductibles, and non-covered services.",
                '',
                'HIPAA ACKNOWLEDGMENT: I acknowledge receipt of the Notice of Privacy Practices and consent to its use for treatment, payment, and healthcare operations.'
            ];

            doc.setTextColor(...textBlack);
            doc.setFontSize(9);
            doc.setFont(undefined, 'normal');

            policyText.forEach(line => {
                if (line === '') {
                    yPos += 4;
                } else {
                    const wrapped = doc.splitTextToSize(line, 170);
                    wrapped.forEach(wrappedLine => {
                        if (yPos > 250) {
                            doc.addPage();
                            this.addProfessionalHeader(doc, headerBlue);
                            yPos = 60;
                        }
                        doc.text(wrappedLine, leftMargin, yPos);
                        yPos += 4;
                    });
                    yPos += 2;
                }
            });

            // Signature section
            yPos += 15;
            if (yPos > 220) {
                doc.addPage();
                this.addProfessionalHeader(doc, headerBlue);
                yPos = 80;
            }

            doc.setDrawColor(...lightGray);
            doc.setLineWidth(0.5);

            doc.line(leftMargin, yPos, leftMargin + 80, yPos);
            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            doc.text('Patient Signature', leftMargin, yPos - 3);

            doc.line(leftMargin + 100, yPos, leftMargin + 150, yPos);
            doc.text('Date', leftMargin + 100, yPos - 3);
            doc.setTextColor(...textBlack);
            doc.text(new Date().toLocaleDateString(), leftMargin + 105, yPos + 8);

            yPos += 20;

            doc.setDrawColor(...lightGray);
            doc.line(leftMargin, yPos, leftMargin + 80, yPos);
            doc.setTextColor(...grayText);
            doc.text('Print Patient Name', leftMargin, yPos - 3);
            doc.setTextColor(...textBlack);
            const patientName = `${this.formData.firstName || ''} ${this.formData.lastName || ''}`.trim();
            doc.text(patientName, leftMargin + 2, yPos + 8);

            doc.setFontSize(8);
            doc.setTextColor(...grayText);
            doc.text(`Form completed: ${new Date().toLocaleString()}`, leftMargin, 285);

            const fileName = `Patient_Form_${this.formData.lastName || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            console.log('PDF generated:', fileName);
        } catch (err) {
            console.error('Error generating PDF:', err);
            alert('There was a problem creating your form. Please try again or contact our office.');
        }
    }

    /* ─── PDF HELPERS ───────────────────────────────────────────────────────── */

    addProfessionalHeader(doc, headerBlue) {
        doc.setFillColor(...headerBlue);
        doc.rect(0, 0, 210, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('ARMONK-SOMERS PODIATRY', 20, 16);

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text("John M. O'Hanlon, D.P.M.", 20, 25);

        doc.setFontSize(9);
        doc.text('Somers: (914) 276-3718', 130, 16);
        doc.text('Armonk: (914) 273-3100', 130, 23);
        doc.text('Comprehensive Foot & Ankle Care', 130, 30);

        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.rect(175, 8, 20, 20, 'S');
        doc.setFontSize(6);
        doc.text('LOGO', 182, 19);
    }

    addSection(doc, title, yPos, headerBlue, textBlack) {
        doc.setTextColor(...headerBlue);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(title, 20, yPos);

        doc.setDrawColor(...headerBlue);
        doc.setLineWidth(0.8);
        doc.line(20, yPos + 2, 190, yPos + 2);

        return 8;
    }

    addField(doc, label, value, x, y) {
        doc.setTextColor(88, 88, 88);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(label, x, y);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const displayValue = value || '';
        const maxLength = 25;
        const truncated = displayValue.length > maxLength
            ? displayValue.substring(0, maxLength - 3) + '...'
            : displayValue;
        doc.text(truncated, x + 2, y + 5);
    }

    addFieldWide(doc, label, value, x, y) {
        doc.setTextColor(88, 88, 88);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(label, x, y);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const displayValue = value || '';
        const maxLength = 60;
        const truncated = displayValue.length > maxLength
            ? displayValue.substring(0, maxLength - 3) + '...'
            : displayValue;
        doc.text(truncated, x + 2, y + 5);
    }

    addTextArea(doc, label, value, x, y) {
        doc.setTextColor(88, 88, 88);
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text(label, x, y);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        if (value) {
            const lines = doc.splitTextToSize(value, 170);
            let lineY = y + 5;
            lines.forEach(line => {
                doc.text(line, x + 2, lineY);
                lineY += 4;
            });
            return (lines.length * 4) + 6;
        }
        return 10;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    }

    /* ─── SUCCESS UI ────────────────────────────────────────────────────────── */

    showSuccess() {
        const shell = this.container.querySelector('.patient-form-shell');
        if (!shell) return;

        shell.innerHTML = `
<div class="form-success-panel">
  <div class="form-success-icon" aria-hidden="true">
    <i class="fas fa-check-circle"></i>
  </div>
  <h1 class="form-success-title">Your Form is Ready!</h1>
  <p class="form-success-message">
    Your patient information form has been completed and downloaded. Please bring the printed form to your appointment with Dr. O'Hanlon.
  </p>
  <div class="form-success-actions">
    <button type="button" class="btn btn--primary" id="downloadAgainBtn">
      <i class="fas fa-download" aria-hidden="true"></i>
      Download Form Again
    </button>
    <a href="contact.html" class="btn btn--secondary">
      <i class="fas fa-arrow-left" aria-hidden="true"></i>
      Back to Contact Page
    </a>
  </div>
  <p class="form-success-help">
    Questions? Call us at <a href="tel:+19142763718">(914) 276-3718</a> (Somers) or <a href="tel:+19142733100">(914) 273-3100</a> (Armonk).
  </p>
</div>
        `;

        const downloadBtn = shell.querySelector('#downloadAgainBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.generatePDF());
        }

        shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/* ─── BOOTSTRAP ─────────────────────────────────────────────────────────────── */

let patientFormInstance;
document.addEventListener('DOMContentLoaded', () => {
    patientFormInstance = new PatientForm();
});
