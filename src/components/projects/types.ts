import { PROJECTS_DATA } from "../../constants";

export type ProjectItem =
  (typeof PROJECTS_DATA)["zh"][keyof (typeof PROJECTS_DATA)["zh"]];
