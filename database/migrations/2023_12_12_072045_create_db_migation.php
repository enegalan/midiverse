<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->softDeletes();
            $table->id()->autoIncrement();
            $table->string('name')->nullable(true);
            $table->string('email')->unique(true);
            $table->string('username')->unique();
            $table->string('lastname')->nullable(true);
            $table->date('birthdate')->nullable(true);
            $table->string('avatar')->nullable(true);
            $table->string('banner')->nullable(true);
            $table->string('description')->nullable(true);
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(true);
            $table->string('sub')->nullable(true); // Google auth verification password
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('user_midis', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('midi')->nullable(false);
            $table->string('name')->nullable(false);
            $table->string('duration')->nullable(false);
            $table->string('description')->nullable(true);
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name');
            $table->string('title');
            $table->timestamps();
        });

        Schema::create('users_roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('user_followers', function (Blueprint $table) {
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('groups', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name')->nullable(false)->unique();
            $table->string('description')->nullable(true);
            $table->string('logo')->nullable(true);
            $table->string('banner')->nullable(true);
            $table->boolean('visibility')->default(0);
            $table->timestamps();
        });

        Schema::create('group_midis', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreignId('user_midi_id')->references('id')->on('user_midis')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('group_members', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('group_roles', function (Blueprint $table) {
            $table->foreignId('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('group_followers', function (Blueprint $table) {
            $table->foreignId('group_id')->references('id')->on('groups')->onDelete('cascade');
            $table->foreignId('follower_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('concerts', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('title')->nullable(false);
            $table->string('description')->nullable(true);
            $table->foreignId('group_id')->nullable(true)->references('id')->on('groups')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->boolean('live')->default(0);
            $table->date('planificated_at')->nullable(true);
        });

        Schema::create('concert_midis', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('concert_id')->references('id')->on('concerts')->onDelete('cascade');
            $table->foreignId('user_midi_id')->nullable(true)->references('id')->on('user_midis')->onDelete('cascade');
            $table->foreignId('group_midi_id')->nullable(true)->references('id')->on('group_midis')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('concert_members', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('concert_id')->references('id')->on('concerts')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('concert_roles', function (Blueprint $table) {
            $table->foreignId('concert_id')->references('id')->on('concerts')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('concert_likes', function (Blueprint $table) {
            $table->foreignId('concert_id')->references('id')->on('concerts')->onDelete('cascade');
            $table->foreignId('user_id')->nullable(true)->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('group_id')->nullable(true)->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('posts', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('content')->nullable(false);
            $table->foreignId('user_midi_id')->nullable(true)->references('id')->on('user_midis')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('post_likes', function (Blueprint $table) {
            $table->foreignId('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('user_post_bookmarks', function (Blueprint $table) {
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('user_concert_bookmarks', function (Blueprint $table) {
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreignId('concert_id')->references('id')->on('concerts')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('post_comments', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('post_id')->references('id')->on('posts')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('content')->nullable(false);
            $table->timestamps();
        });

        Schema::create('post_comments_likes', function (Blueprint $table) {
            $table->foreignId('post_comment_id')->references('id')->on('post_comments')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('post_comment_replies', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('post_comment_id')->references('id')->on('post_comments')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('content')->nullable(false);
            $table->timestamps();
        });

        Schema::create('post_comment_reply_likes', function (Blueprint $table) {
            $table->foreignId('post_comment_reply_id')->references('id')->on('post_comment_replies')->onDelete('cascade');
            $table->foreignId('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_roles');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('user_followers');
        Schema::dropIfExists('group_followers');
        Schema::dropIfExists('group_roles');
        Schema::dropIfExists('group_members');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('concert_likes');
        Schema::dropIfExists('concert_roles');
        Schema::dropIfExists('concert_members');
        Schema::dropIfExists('user_concert_bookmarks');
        Schema::dropIfExists('concerts');
        Schema::dropIfExists('comment_replies');
        Schema::dropIfExists('post_comments');
        Schema::dropIfExists('user_post_bookmarks');
        Schema::dropIfExists('post_likes');
        Schema::dropIfExists('posts');
    }
};
