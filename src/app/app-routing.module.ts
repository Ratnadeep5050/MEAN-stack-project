import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PasswordChangeComponent } from './auth/password-change/password-change.component';

const routes: Routes = [
  {path: 'postEdit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: 'userProfileEdit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
  {path: '', component: PostListComponent },
  {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuard]},
  {path: 'passwordChange', component: PasswordChangeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
