--------------------------------------------------------------------------
-- Author:       Paúl Rodríguez García
-- Date:         2024-05-18
-- Description:  Deletes a post from the database.
--------------------------------------------------------------------------

CREATE OR ALTER PROCEDURE [dbo].[EmprendeTEC_SP_Posts_Delete]
    -- Parameters
    @IN_postId INT,
    @IN_currentUserEmail VARCHAR(128) -- The user currently logged in
AS
BEGIN
    SET NOCOUNT ON;
    -- Do not return metadata

    -- ERROR HANDLING
    DECLARE @ErrorNumber INT, @ErrorSeverity INT, @ErrorState INT, @Message VARCHAR(200);
    DECLARE @transactionStarted BIT = 0;

    -- VARIABLE DECLARATION
    DECLARE @currentUserId INT;

    BEGIN TRY

        -- VALIDATIONS
        -- Check if the post exists
        IF NOT EXISTS (SELECT 1 FROM [dbo].[Posts] WHERE [postId] = @IN_postId)
            BEGIN
                RAISERROR ('El emprendimiento no existe.', 16, 1);
            END;

        -- Check if the current user exists
        SELECT @currentUserId = [userId]
        FROM [dbo].[Users]
        WHERE [email] = @IN_currentUserEmail;

        IF @currentUserId IS NULL
            BEGIN
                RAISERROR (N'No se encontró tu usuario.', 16, 1);
            END;

        -- Check if the current user is the author of the post
        IF NOT EXISTS (SELECT 1 FROM [dbo].[Posts] WHERE [postId] = @IN_postId AND [userId] = @currentUserId) AND
           NOT EXISTS (SELECT 1
                       FROM [dbo].[Users]
                                INNER JOIN [dbo].[UserTypes] ON [Users].[userTypeId] = [UserTypes].[userTypeId]
                       WHERE [email] = @IN_currentUserEmail
                         AND [UserTypes].[roleName] = 'Administrator')
            BEGIN
                RAISERROR (N'No tenés los permisos necesarios para administrar el emprendimiento.', 16, 1);
            END;

        -- START TRANSACTION
        IF @@TRANCOUNT = 0
            BEGIN
                SET @transactionStarted = 1;
                BEGIN TRANSACTION;
            END;

        -- Delete the post images, if not used by other posts
        DELETE FROM [dbo].[PostImages]
        WHERE [postId] = @IN_postId AND
              (SELECT COUNT(*)
               FROM [dbo].[PostImages] P2
               WHERE P2.[imageUrl] = [PostImages].[imageUrl]) = 1;

        -- Delete the reviews of the post
        DELETE FROM [dbo].[Reviews]
        WHERE [postId] = @IN_postId;

        -- Delete the post
        DELETE FROM [dbo].[Posts]
        WHERE [postId] = @IN_postId;

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