import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth-service';
import { HttpClient } from '@angular/common/http';
import { Post } from '../posts/post.model';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Subject } from 'rxjs';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class UserProfileService {
  private posts: Post[] = [];
  private postUpdate = new Subject<{post: Post[], postCount: number}>();

  constructor(
    private http: HttpClient,
    private route: Router,
    private authService: AuthService
  ) {}

  getPosts(userId: string, currentPage: number) {
    console.log(userId);
    this.http.get<{message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/post/' + userId)
    .pipe(map((postData) => {
      console.log(postData);
      return { posts: postData.posts.map((post) => {
        return {
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }),
      maxPosts: postData.maxPosts};
    }))
    .subscribe(transformedPostsData => {
      this.posts = transformedPostsData.posts;
      this.postUpdate.next({
        post: [...this.posts],
        postCount: transformedPostsData.maxPosts
      });
    });
  }

  getOnUpdateListener() {
    return this.postUpdate.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
    .subscribe(responseData => {
      this.route.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put('http://localhost:3000/api/post/' + id, postData)
    .subscribe(response => {
      this.route.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
