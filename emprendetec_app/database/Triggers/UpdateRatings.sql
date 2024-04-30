--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-04-30
-- Description:  This trigger updates the rating of a post and the rating
--               of the author of the post when a review is inserted,
--               updated or deleted.
--------------------------------------------------------------------------

CREATE OR ALTER TRIGGER EmprendeTEC_trg_UpdateRatings
    ON Reviews
    AFTER INSERT, UPDATE, DELETE
    AS
BEGIN
    SET NOCOUNT ON;

    -- Temporary table to hold affected PostIDs and UserIDs
    DECLARE @AffectedPosts TABLE
                           (
                               postId   INT
                           );

    -- Capture affected PostIDs from inserted and deleted tables
    INSERT INTO @AffectedPosts (postId)
    SELECT postId
    FROM inserted
    UNION
    SELECT postId
    FROM deleted;

    -- Update Ratings for affected Posts
    UPDATE P
    SET P.rating = COALESCE((SELECT AVG(rating)
                             FROM Reviews
                             WHERE postId = P.postId), NULL)
    FROM Posts P
             JOIN @AffectedPosts AP
                  ON P.postId = AP.postId;

    -- Update Ratings for affected Users
    UPDATE U
    SET U.rating = COALESCE((SELECT AVG(R.rating)
                             FROM Reviews R
                             INNER JOIN Posts P
                               ON R.postId = P.postId
                             WHERE P.userId = U.userId), NULL)
    FROM Users U
             JOIN Posts P
                  ON U.userId = P.userId
                JOIN @AffectedPosts AP
                        ON P.postId = AP.postId;
END;