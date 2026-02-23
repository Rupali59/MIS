export interface ClassifiedUrl {
  section: string | null;
  subSection: string | null;
}

export function classifyNitGoaUrl(pathname: string): ClassifiedUrl {
  const path = pathname || "/";

  if (path.startsWith("/academics/") || path === "/academic_calendar.html") {
    if (path.includes("ComputerScience")) {
      return { section: "department", subSection: "ComputerScience" };
    }
    if (path.includes("Electrical")) {
      return { section: "department", subSection: "Electrical" };
    }
    if (path.includes("Electronics")) {
      return { section: "department", subSection: "Electronics" };
    }
    if (path.includes("Civil")) {
      return { section: "department", subSection: "Civil" };
    }
    if (path.includes("Mechnical") || path.includes("Mechanical")) {
      return { section: "department", subSection: "Mechanical" };
    }
    if (path.includes("AppliedScience")) {
      return { section: "department", subSection: "AppliedScience" };
    }
    if (path.includes("Humanities")) {
      return { section: "department", subSection: "Humanities" };
    }
    return { section: "academics", subSection: null };
  }

  if (path.startsWith("/ComputerScience/")) {
    return { section: "department", subSection: "ComputerScience" };
  }
  if (path.startsWith("/Electrical/")) {
    return { section: "department", subSection: "Electrical" };
  }
  if (path.startsWith("/Electronics/")) {
    return { section: "department", subSection: "Electronics" };
  }
  if (path.startsWith("/civil_department/")) {
    return { section: "department", subSection: "Civil" };
  }
  if (path.startsWith("/Mechanical/")) {
    return { section: "department", subSection: "Mechanical" };
  }
  if (path.startsWith("/Applied%20Science/")) {
    return { section: "department", subSection: "AppliedScience" };
  }
  if (path.startsWith("/Humanities/")) {
    return { section: "department", subSection: "Humanities" };
  }

  if (path.startsWith("/People/frontend/") || path.startsWith("/People/index")) {
    return { section: "people", subSection: "frontendProfiles" };
  }

  if (path.startsWith("/admissions/")) {
    return { section: "admissions", subSection: null };
  }

  if (path.startsWith("/library/")) {
    return { section: "library", subSection: null };
  }

  if (path.startsWith("/research/")) {
    return { section: "research", subSection: null };
  }

  if (path.startsWith("/placementcell/") || path.startsWith("/alumni/") || path.startsWith("/pages/")) {
    return { section: "placement_alumni", subSection: null };
  }

  if (path === "/" || path === "/index.html") {
    return { section: "home", subSection: null };
  }

  if (path === "/RTI.html" || path === "/rti.html") {
    return { section: "compliance", subSection: "RTI" };
  }

  if (path === "/tenders.html") {
    return { section: "compliance", subSection: "tenders" };
  }

  return { section: null, subSection: null };
}

