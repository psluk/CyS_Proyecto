--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-04-30
-- Description:  Rates a post
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_RatePost]
    -- Parameters
    @IN_authorEmail VARCHAR(128),
    @IN_postId INT,
    @IN_rating INT,
    @IN_comment VARCHAR(256)
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @modifyPostRating BIT = 0;
    DECLARE @userId INT = NULL;

    BEGIN TRY

        -- VALIDATIONS
        IF NOT EXISTS (SELECT 1
                       FROM Posts P
                       WHERE P.postId = @IN_postId)
            BEGIN
                RAISERROR ('No existe el emprendimiento.', 16, 1);
            END;

        SELECT @userId = userId
        FROM Users
        WHERE email = @IN_authorEmail;

        IF @userId IS NULL
            BEGIN
                RAISERROR ('No existe el usuario.', 16, 1);
            END;

        IF @IN_rating < 1 OR @IN_rating > 5
            BEGIN
                RAISERROR (N'La calificación debe ser un número entre 1 y 5.', 16, 1);
            END;

        IF EXISTS (SELECT 1
                   FROM Posts P
                   WHERE P.postId = @IN_postId
                     AND P.userId = @userId)
            BEGIN
                RAISERROR ('No podés calificar tu propio emprendimiento.', 16, 1);
            END;

        IF EXISTS (SELECT 1
                   FROM Reviews R
                            JOIN Users U
                                 ON R.authorId = U.userId
                   WHERE R.postId = @IN_postId
                     AND U.email = @IN_authorEmail)
            BEGIN
                SET @modifyPostRating = 1;
            END;


        -- START TRANSACTION
        IF @@TRANCOUNT = 0
            BEGIN
                SET @transactionStarted = 1;
                BEGIN TRANSACTION;
            END;

        IF @modifyPostRating = 1
            BEGIN
                UPDATE Reviews
                SET rating    = @IN_rating,
                    comment   = @IN_comment,
                    timestamp = GETUTCDATE()
                WHERE postId = @IN_postId
                  AND authorId = @userId;
            END;
        ELSE
            BEGIN
                INSERT INTO Reviews
                    (postId, authorId, rating, comment, timestamp)
                VALUES (@IN_postId, @userId, @IN_rating, @IN_comment, GETUTCDATE());
            END;

        -- COMMIT TRANSACTION
        IF @transactionStarted = 1
            BEGIN
                COMMIT TRANSACTION;
            END;

    END TRY
    BEGIN CATCH

        SET @ErrorNumber = ERROR_NUMBER();
        SET @ErrorSeverity = ERROR_SEVERITY();
        SET @ErrorState = ERROR_STATE();
        SET @Message = ERROR_MESSAGE();

        IF @transactionStarted = 1
            BEGIN
                ROLLBACK;
            END;

        IF @ErrorNumber != 50000
            BEGIN
                -- If it's not a custom error, log the error
                INSERT INTO [dbo].[Errors]
                VALUES (SUSER_NAME(),
                        ERROR_NUMBER(),
                        ERROR_STATE(),
                        ERROR_SEVERITY(),
                        ERROR_LINE(),
                        ERROR_PROCEDURE(),
                        ERROR_MESSAGE(),
                        GETUTCDATE());
            END;

        RAISERROR ('%s - Error Number: %i',
            @ErrorSeverity, @ErrorState, @Message, @ErrorNumber);

    END CATCH;
END;