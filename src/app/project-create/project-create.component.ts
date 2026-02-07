import {Component, inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../core/service/api';
import {CoreModule} from '../core/core.module';
import {TeamDto} from '../core/model/model';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {

  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  projectForm: FormGroup;
  projectOptions: any[] = [];
  searchingProject: boolean = false;
  branches: any[] = [];
  existingBranches: string[] = [];
  loadingBranches: boolean = false;
  existingVersions: string[] = [];
  teams: TeamDto[] = [];
  loadingTeams: boolean = false;

  constructor() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      repository_url: ['', Validators.required],
      repository_id: ['', Validators.required],
      project_version_id: ['', [Validators.required, this.existingVersionValidator.bind(this)]],
      branch_id: ['', Validators.required],
      team_id: ['', Validators.required],
    });
  }

  existingVersionValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value && value !== 0) {
      return null;
    }

    const stringValue = String(value).trim();

    if (this.existingVersions && this.existingVersions.some(v => String(v).trim() === stringValue)) {
      return { versionAlreadyExists: { value: value } };
    }

    return null;
  }

  ngOnInit(): void {
    this.loadTeams();

    const projectVersionControl = this.projectForm.get('project_version_id');
    if (projectVersionControl) {
      projectVersionControl.valueChanges.subscribe(() => {
        projectVersionControl.updateValueAndValidity({ emitEvent: false });
      });
    }
  }

  loadTeams(): void {
    this.loadingTeams = true;
    this.apiService.getTeams().subscribe({
      next: (data) => {
        this.teams = data.items;
        this.loadingTeams = false;
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.loadingTeams = false;
      }
    });
  }

  onProjectSearch(pattern: string): void {
    this.projectForm.patchValue({
      repository_url: '',
      repository_id: '',
      project_version_id: '',
      branch_id: ''
    });
    this.projectOptions = [];
    this.branches = [];
    this.existingBranches = [];
    this.existingVersions = [];

    if (pattern.length > 2) {
      this.searchingProject = true;
      this.apiService.searchRepository(pattern).subscribe(
        (data) => {
          this.projectOptions = data;
          this.searchingProject = false;
        },
        (error) => {
          console.error('Error fetching project options:', error);
          this.searchingProject = false;
        }
      );
    }
  }

  onProjectSelected(project: any): void {
    this.projectForm.patchValue({
      name: project.name,
      repository_url: project.repository_url,
      repository_id: project.id
    });

    this.loadingBranches = true;
    this.apiService.getProjectBranches(project.id).subscribe({
      next: (branches) => {
        this.branches = branches;
        this.loadingBranches = false;

        this.loadExistingVersions(project.id);
      },
      error: (error) => {
        console.error('Error fetching branches:', error);
        this.loadingBranches = false;
      }
    });
  }

  loadExistingVersions(repositoryId: string | number): void {
    this.apiService.findVersionsByRepository(repositoryId).subscribe({
      next: (versions) => {
        // Store the version numbers from existing versions
        if (versions.items && Array.isArray(versions.items)) {
          this.existingVersions = versions.items.map((version: any) => version.version);
        } else {
          this.existingVersions = [];
        }

        // Check each branch against existing project versions to see if it's already used
        this.branches.forEach(branch => {
          const branchExists = versions.items.some((version: any) => version.branch_id === branch.name);
          if (branchExists) {
            this.existingBranches.push(branch.name);
          }
        });

        // Force validation update for project_version_id field
        const projectVersionControl = this.projectForm.get('project_version_id');
        if (projectVersionControl) {
          projectVersionControl.updateValueAndValidity({ emitEvent: false });
        }
      },
      error: (error) => {
        console.error('Error checking existing versions:', error);
      }
    });
  }

  isBranchDisabled(branchName: string): boolean {
    return this.existingBranches.includes(branchName);
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const projectData = {
        name: this.projectForm.get('name')?.value,
        repository_id: parseInt(this.projectForm.get('repository_id')?.value, 10),
        repository_url: this.projectForm.get('repository_url')?.value
      };

      this.apiService.createProject(projectData).subscribe({
        next: (response) => {
          // Now that the project is created, we can create the linked project version
          const projectVersionData = {
            version: this.projectForm.get('project_version_id')?.value,
            team: 'teams/' + this.projectForm.get('team_id')?.value,
            project: 'projects/' + response.id,
            branch_id: this.projectForm.get('branch_id')?.value
          };
          this.apiService.createProjectVersion(projectVersionData).subscribe({
            next: () => {
              // Success: Show snackbar and reset form
              this.snackBar.open('Project created successfully!', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar']
              });
              this.resetForm();
            },
            error: (error) => {
              console.error('Error creating project version', error);
              this.snackBar.open('Error creating project version. Please try again.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
              });
            },
          });
        },
        error: (error) => {
          console.error('Error creating project', error);
          this.snackBar.open('Error creating project. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        },
      });
    }
  }

  resetForm(): void {
    this.projectForm.reset();
    this.projectOptions = [];
    this.branches = [];
    this.existingBranches = [];
    this.existingVersions = [];
  }
}
