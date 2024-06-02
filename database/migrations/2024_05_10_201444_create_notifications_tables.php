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
        Schema::create('user_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('id')->on('users');
            $table->foreignId('from_user_id')->references('id')->on('users');
            $table->string('message')->nullable(false);
            $table->tinyInteger('type')->default(0);
            /*
            --------TYPES--------
            Follow Requests => 0

            Likes => 1
            
            Bookmarks => 2
            
            Comments => 3
            
            Rol Assigments => 4

            Request Accepted => 5

            Invitation => 6

            Direct Message => 7

            */
            $table->boolean('viewed')->default(0);
            $table->timestamps();
        });
        Schema::create('group_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('group_id')->references('id')->on('groups');
            $table->foreignId('from_user_id')->references('id')->on('users');
            $table->string('message')->nullable(false);
            $table->tinyInteger('type')->default(0);
            /*
            --------TYPES--------
            Follow Requests => 0

            Likes => 1
            
            Bookmarks => 2
            
            Comments => 3
            
            Rol Assigments => 4

            Request Accepted => 5

            Invites => 6
            */
            $table->boolean('viewed')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_notifications');
        Schema::dropIfExists('group_notifications');
    }
};
