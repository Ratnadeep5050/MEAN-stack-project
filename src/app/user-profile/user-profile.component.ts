import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from '../auth/auth-service';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-post-list',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  userIsAuthenticated = false;
  totalPosts = 0;
  postsPerPage = 10;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userId: string;

  private authSub: Subscription;
  constructor(public userProfileService: UserProfileService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.userProfileService.getPosts(this.userId, this.currentPage);
    this.postsSub = this.userProfileService
    .getOnUpdateListener()
    .subscribe((postData: {post: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.post;
    });
    this.userIsAuthenticated = this.authService.getAuth();
    this.authSub = this.authService.getAuthListenerSubs()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.userProfileService.deletePost(postId).subscribe(response => {
      this.userProfileService.getPosts(this.userId, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.userProfileService.getPosts(this.userId, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
